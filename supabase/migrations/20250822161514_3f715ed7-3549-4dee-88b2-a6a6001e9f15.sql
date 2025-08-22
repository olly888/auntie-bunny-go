
-- Enable extension for UUID generation (commonly available on Supabase)
create extension if not exists pgcrypto;

-- 1) 门店表
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  address text,
  created_at timestamptz not null default now()
);

alter table public.stores enable row level security;

-- 所有人可读取门店（用于选择所属门店、展示）
create policy "Anyone can read stores"
on public.stores
for select
using (true);

-- 2) 用户档案（与 Supabase Auth 关联）
create table if not exists public.profiles (
  id uuid not null primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  role text not null default 'worker' check (role in ('worker','user','admin')),
  store_id uuid references public.stores,
  wecom_qr_url text, -- 企业微信渠道活码地址（可选）
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 仅本人可读
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

-- 仅本人可更新
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- updated_at 自动更新
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- 可选：新用户注册时自动创建 profile（从 Auth 的元数据复制部分字段）
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null), coalesce(new.phone, null), 'worker')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 3) 邀请记录表（每位邀请人每种类型可有一个默认码，亦可扩展多码）
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references public.profiles(id) on delete cascade,
  invite_type text not null check (invite_type in ('user','worker')),
  ref_code text not null,
  invitee_profile_id uuid references public.profiles(id),
  status text not null default 'created' check (status in ('created','scanned','registered','qualified','rewarded')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (inviter_id, invite_type, ref_code)
);

create index if not exists idx_referrals_inviter on public.referrals(inviter_id);
create index if not exists idx_referrals_code on public.referrals(ref_code);

alter table public.referrals enable row level security;

-- 仅邀请人本人可操作/查看
create policy "Inviter can read own referrals"
on public.referrals
for select
using (auth.uid() = inviter_id);

create policy "Inviter can insert own referrals"
on public.referrals
for insert
with check (auth.uid() = inviter_id);

create policy "Inviter can update own referrals"
on public.referrals
for update
using (auth.uid() = inviter_id)
with check (auth.uid() = inviter_id);

create or replace function public.set_updated_at_referrals()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_referrals_updated_at on public.referrals;
create trigger trg_referrals_updated_at
before update on public.referrals
for each row execute function public.set_updated_at_referrals();

-- 3.1) 生成或返回当前用户某类型的默认专属码
create or replace function public.ensure_referral(invite_type text)
returns public.referrals
language plpgsql
security definer set search_path = public
as $$
declare
  rec public.referrals;
begin
  if invite_type not in ('user','worker') then
    raise exception 'invalid invite_type';
  end if;

  select * into rec
  from public.referrals
  where inviter_id = auth.uid()
    and invite_type = ensure_referral.invite_type
  order by created_at asc
  limit 1;

  if not found then
    insert into public.referrals (inviter_id, invite_type, ref_code, status)
    values (auth.uid(), ensure_referral.invite_type, substr(replace(gen_random_uuid()::text,'-',''),1,8), 'created')
    returning * into rec;
  end if;

  return rec;
end;
$$;

grant execute on function public.ensure_referral(text) to authenticated;

-- 4) 邀请事件表（后续用于扫码/注册/达标/奖励）
do $$
begin
  if not exists (select 1 from pg_type where typname = 'referral_event_type') then
    create type referral_event_type as enum ('scan','register','qualify','reward');
  end if;
end $$;

create table if not exists public.referral_events (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals(id) on delete cascade,
  event_type referral_event_type not null,
  user_agent text,
  ip_hash text,
  extra jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_referral_events_referral on public.referral_events(referral_id);
create index if not exists idx_referral_events_type on public.referral_events(event_type);

alter table public.referral_events enable row level security;

-- 邀请人可查看属于自己邀请的事件
create policy "Inviter can read own referral events"
on public.referral_events
for select
using (
  exists (
    select 1 from public.referrals r
    where r.id = referral_events.referral_id
      and r.inviter_id = auth.uid()
  )
);

-- 默认不允许客户端插入事件（后续通过边缘函数或服务端插入，避免滥用）
