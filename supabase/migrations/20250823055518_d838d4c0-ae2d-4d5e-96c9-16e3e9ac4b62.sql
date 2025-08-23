
-- 1) 确保 orders 表启用 Realtime（若已添加则跳过）
ALTER TABLE public.orders REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'orders'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.orders';
  END IF;
END$$;

-- 2) 统一的过滤函数：返回“同门店的 pending + 我自己被指派/进行中/已完成”的订单
CREATE OR REPLACE FUNCTION public.get_filtered_orders()
RETURNS SETOF public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id  uuid := auth.uid();
  v_store_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    -- 未登录则不返回任何数据
    RETURN;
  END IF;

  SELECT p.store_id INTO v_store_id
  FROM public.profiles p
  WHERE p.id = v_user_id;

  RETURN QUERY
    SELECT o.*
    FROM public.orders o
    WHERE
      -- 任务大厅：同门店的待抢订单
      (o.store_id = v_store_id AND o.status = 'pending')
      OR
      -- 当前任务/历史：我自己被指派的订单（含进行中/完成）
      (o.assignee_id = v_user_id AND o.status IN ('assigned', 'in_progress', 'completed'))
    ORDER BY o.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_filtered_orders() TO anon, authenticated;

-- 3) 原子化抢单
CREATE OR REPLACE FUNCTION public.claim_order(order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id  uuid := auth.uid();
  v_store_id uuid;
  v_claimed  boolean := false;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT p.store_id INTO v_store_id
  FROM public.profiles p
  WHERE p.id = v_user_id;

  -- 仅当：同门店 + 仍为 pending + 尚未被指派，才能成功抢单
  UPDATE public.orders o
  SET assignee_id = v_user_id,
      status      = 'assigned',
      assigned_at = now(),
      updated_at  = now()
  WHERE o.id = claim_order.order_id
    AND o.status = 'pending'
    AND (o.assignee_id IS NULL)
    AND o.store_id = v_store_id
  RETURNING TRUE INTO v_claimed;

  RETURN COALESCE(v_claimed, FALSE);
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_order(uuid) TO authenticated;

-- 4) 生成演示订单（插入一张同门店的 pending 单）
CREATE OR REPLACE FUNCTION public.create_demo_order_for_my_store()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id  uuid := auth.uid();
  v_store_id uuid;
  v_id       uuid;
  v_types    text[] := ARRAY['洗碗兔','客厅兔','厨房兔','全屋兔'];
  v_type     text;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT p.store_id INTO v_store_id
  FROM public.profiles p
  WHERE p.id = v_user_id;

  -- 若当前用户还没有门店，自动创建一个并挂载到资料上
  IF v_store_id IS NULL THEN
    INSERT INTO public.stores(name, address)
    VALUES ('演示门店', '演示地址')
    RETURNING id INTO v_store_id;

    UPDATE public.profiles
    SET store_id = v_store_id
    WHERE id = v_user_id;
  END IF;

  v_type := v_types[1 + floor(random()*array_length(v_types,1))::int];

  INSERT INTO public.orders(
    type, address, payout, duration_minutes, status, store_id,
    contact_name, contact_phone, latitude, longitude, distance_minutes,
    created_at, updated_at
  ) VALUES (
    v_type,
    '演示区域',
    round((50 + random()*100)::numeric, 2),
    60,
    'pending',
    v_store_id,
    '张三',
    '1380000' || lpad((floor(random()*9999))::int::text, 4, '0'),
    NULL, NULL, 15,
    now(), now()
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_demo_order_for_my_store() TO authenticated;
