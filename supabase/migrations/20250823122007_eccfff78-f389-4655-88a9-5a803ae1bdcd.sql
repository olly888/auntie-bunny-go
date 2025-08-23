
-- 1) 创建银行卡表（仅保存后四位，避免存储完整卡号）
create table if not exists public.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles(id) on delete cascade,
  bank_name text not null,
  account_holder text not null,
  account_number_last4 text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) 启用 RLS
alter table public.bank_accounts enable row level security;

-- 3) RLS 策略：仅本人可读写删
create policy "Users can view their own bank accounts"
  on public.bank_accounts for select
  using (auth.uid() = owner_profile_id);

create policy "Users can insert their own bank accounts"
  on public.bank_accounts for insert
  with check (auth.uid() = owner_profile_id);

create policy "Users can update their own bank accounts"
  on public.bank_accounts for update
  using (auth.uid() = owner_profile_id)
  with check (auth.uid() = owner_profile_id);

create policy "Users can delete their own bank accounts"
  on public.bank_accounts for delete
  using (auth.uid() = owner_profile_id);

-- 4) 仅允许每位用户一个默认账户（局部唯一索引）
create unique index if not exists bank_accounts_one_default_per_user
  on public.bank_accounts(owner_profile_id)
  where is_default;

-- 5) 更新触发器：自动写入 updated_at
drop trigger if exists set_updated_at_bank_accounts on public.bank_accounts;
create trigger set_updated_at_bank_accounts
  before update on public.bank_accounts
  for each row execute function public.set_updated_at();
