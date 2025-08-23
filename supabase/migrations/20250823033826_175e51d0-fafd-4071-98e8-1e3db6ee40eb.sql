
begin;

-- 1) 收紧 orders 的 SELECT RLS：同店可见 pending + 自己的订单总可见
drop policy if exists "Workers can view pending orders (public fields)" on public.orders;

create policy "Workers can view pending orders in same store"
on public.orders
for select
using (
  (auth.uid() = assignee_id)
  or
  (
    status = 'pending'
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.store_id is not null
        and p.store_id = public.orders.store_id
    )
  )
);

-- 2) 保护 abnormal_orders：开启 RLS + 管理员可读
alter table public.abnormal_orders enable row level security;

drop policy if exists "Managers can view abnormal orders" on public.abnormal_orders;

create policy "Managers can view abnormal orders"
on public.abnormal_orders
for select
using (
  exists (
    select 1 from public.profiles pr
    where pr.id = auth.uid()
      and pr.role in ('manager','owner','admin')
      and (pr.store_id is null or pr.store_id = public.abnormal_orders.store_id)
  )
);

-- 3) 去重：同一订单仅入池一次（id 作为订单ID使用）
create unique index if not exists abnormal_orders_unique_order on public.abnormal_orders(id);

-- 4) 自动入池函数：pending 且创建时间超过 40s（10s 广播 + 30s 大厅）
create or replace function public.escalate_stale_orders(threshold_seconds integer default 40)
returns integer
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  inserted_count integer := 0;
begin
  insert into public.abnormal_orders (
    id, type, duration_minutes, address, payout, distance_minutes, status,
    created_at, assigned_at, started_at, completed_at, assignee_id,
    store_id, latitude, longitude, updated_at
  )
  select
    o.id, o.type, o.duration_minutes, o.address, o.payout, o.distance_minutes, o.status,
    o.created_at, o.assigned_at, o.started_at, o.completed_at, o.assignee_id,
    o.store_id, o.latitude, o.longitude, now()
  from public.orders o
  where
    o.status = 'pending'
    and o.created_at <= now() - make_interval(secs => threshold_seconds)
    and not exists (
      select 1 from public.abnormal_orders a where a.id = o.id
    )
  on conflict (id) do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

-- 5) 每分钟定时扫描入池
create extension if not exists pg_cron with schema extensions;

do $$
begin
  if not exists (select 1 from cron.job where jobname = 'escalate-stale-orders-every-minute') then
    perform cron.schedule(
      'escalate-stale-orders-every-minute',
      '* * * * *',
      $$ select public.escalate_stale_orders(40); $$
    );
  end if;
end
$$;

commit;
