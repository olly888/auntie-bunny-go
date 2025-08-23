
-- 1) 创建/替换：为当前用户门店生成一笔演示订单
create or replace function public.create_demo_order_for_my_store()
returns uuid
language plpgsql
security definer
set search_path = 'public'
as $function$
declare
  my_profile record;
  my_store_id uuid;
  new_order_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- 确保有 profile
  select id, store_id into my_profile
  from public.profiles
  where id = auth.uid();

  if not found then
    insert into public.profiles (id, full_name, role, created_at, updated_at)
    values (auth.uid(), '演示用户', 'worker', now(), now())
    on conflict (id) do nothing;

    select id, store_id into my_profile
    from public.profiles
    where id = auth.uid();
  end if;

  -- 若没有门店，创建一个演示门店并绑定
  if my_profile.store_id is null then
    insert into public.stores (name, address)
    values ('演示门店', '演示地址')
    returning id into my_store_id;

    update public.profiles
    set store_id = my_store_id, updated_at = now()
    where id = my_profile.id;
  else
    my_store_id := my_profile.store_id;
  end if;

  -- 插入一笔待抢演示订单
  insert into public.orders (
    id, type, duration_minutes, address, latitude, longitude, payout,
    status, created_at, updated_at, store_id, distance_minutes, contact_phone, contact_name
  ) values (
    gen_random_uuid(),
    'cleaning',
    90,
    '演示小区A区3号楼',
    null, null,
    88,
    'pending',
    now(),
    now(),
    my_store_id,
    15,
    null, null
  )
  returning id into new_order_id;

  return new_order_id;
end;
$function$;

-- 2) 确保 Realtime 正常：完整行镜像并加入 realtime publication
alter table public.orders replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    execute 'alter publication supabase_realtime add table public.orders';
  end if;
end $$;
