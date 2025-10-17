-- 创建函数：为当前用户生成已完成的测试订单
CREATE OR REPLACE FUNCTION public.create_demo_completed_orders()
RETURNS TABLE(order_id uuid, order_type text, status text, payout numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  my_profile record;
  my_store_id uuid;
  order_types text[] := ARRAY['cleaning', 'maintenance', 'delivery'];
  addresses text[] := ARRAY['华润城润府', '万科云城', '海岸城', '深业上城', '卓越世纪中心'];
  new_order_id uuid;
  i integer;
BEGIN
  -- 检查用户是否已登录
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION '请先登录';
  END IF;

  -- 获取用户资料
  SELECT id, store_id INTO my_profile
  FROM public.profiles
  WHERE id = auth.uid();

  -- 如果用户没有资料，创建一个
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
    VALUES (auth.uid(), '测试用户', 'worker', now(), now())
    ON CONFLICT (id) DO NOTHING;

    SELECT id, store_id INTO my_profile
    FROM public.profiles
    WHERE id = auth.uid();
  END IF;

  -- 如果没有门店，创建一个测试门店
  IF my_profile.store_id IS NULL THEN
    INSERT INTO public.stores (name, address)
    VALUES ('测试门店', '深圳市南山区')
    RETURNING id INTO my_store_id;

    UPDATE public.profiles
    SET store_id = my_store_id, updated_at = now()
    WHERE id = my_profile.id;
  ELSE
    my_store_id := my_profile.store_id;
  END IF;

  -- 创建5个不同状态的已完成测试订单
  FOR i IN 1..5 LOOP
    new_order_id := gen_random_uuid();
    
    INSERT INTO public.orders (
      id, 
      type, 
      duration_minutes, 
      address, 
      latitude, 
      longitude, 
      payout,
      status, 
      created_at,
      assigned_at,
      started_at,
      completed_at,
      assignee_id,
      store_id, 
      distance_minutes, 
      contact_phone, 
      contact_name,
      settled,
      settled_at,
      total_amount,
      paid_amount,
      updated_at
    ) VALUES (
      new_order_id,
      order_types[(i % 3) + 1],  -- 循环使用订单类型
      60 + (i * 30),  -- 60, 90, 120, 150, 180 分钟
      addresses[(i % 5) + 1],  -- 循环使用地址
      22.5 + (random() * 0.1),  -- 深圳纬度范围
      113.9 + (random() * 0.1),  -- 深圳经度范围
      50 + (i * 20.5),  -- 递增的服务费
      'completed',  -- 已完成状态
      now() - interval '7 days' + (i || ' days')::interval,  -- 过去7天内不同时间创建
      now() - interval '7 days' + (i || ' days')::interval + interval '5 minutes',  -- 分配时间
      now() - interval '7 days' + (i || ' days')::interval + interval '10 minutes',  -- 开始时间
      now() - interval '7 days' + (i || ' days')::interval + interval '2 hours',  -- 完成时间
      auth.uid(),  -- 分配给当前用户
      my_store_id,
      10 + (i * 2),  -- 距离时间
      '138****' || (1000 + i)::text,  -- 客户电话
      '客户' || i::text,  -- 客户姓名
      CASE WHEN i <= 3 THEN true ELSE false END,  -- 前3个已结算，后2个待结算
      CASE WHEN i <= 3 THEN now() - interval '3 days' ELSE null END,  -- 结算时间
      (50 + (i * 20.5)) * 1.15,  -- 订单总额（含平台费用）
      50 + (i * 20.5),  -- 用户实付金额
      now()
    );

    -- 返回创建的订单信息
    RETURN QUERY
    SELECT 
      new_order_id,
      order_types[(i % 3) + 1],
      'completed'::text,
      (50 + (i * 20.5))::numeric;
  END LOOP;

  RETURN;
END;
$$;

-- 添加函数说明
COMMENT ON FUNCTION public.create_demo_completed_orders() IS '为当前登录用户创建5个已完成状态的测试订单，用于测试收入明细和订单详情功能';
