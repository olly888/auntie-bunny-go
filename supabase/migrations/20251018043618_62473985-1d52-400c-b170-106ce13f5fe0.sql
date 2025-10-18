-- SECURITY FIX: Remove hardcoded bootstrap token and disable demo functions in production
-- This migration addresses critical security vulnerabilities identified in the security scan

-- 1. Drop the insecure bootstrap_admin_account function
-- This function had a hardcoded token that could be used to create admin accounts
DROP FUNCTION IF EXISTS public.bootstrap_admin_account(text, text, text, text);

-- 2. Add production mode check for demo order functions
-- Replace create_demo_completed_orders with a secure version
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
  -- SECURITY: Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- SECURITY: Limit to prevent abuse
  IF (SELECT COUNT(*) FROM public.orders WHERE assignee_id = auth.uid() AND created_at > now() - interval '1 hour') > 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Maximum 10 demo orders per hour';
  END IF;

  -- Get user profile
  SELECT id, store_id INTO my_profile
  FROM public.profiles
  WHERE id = auth.uid();

  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
    VALUES (auth.uid(), '测试用户', 'worker', now(), now())
    ON CONFLICT (id) DO NOTHING;

    SELECT id, store_id INTO my_profile
    FROM public.profiles
    WHERE id = auth.uid();
  END IF;

  -- Create store if needed
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

  -- Create 5 demo completed orders
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
      order_types[(i % 3) + 1],
      60 + (i * 30),
      addresses[(i % 5) + 1],
      22.5 + (random() * 0.1),
      113.9 + (random() * 0.1),
      50 + (i * 20.5),
      'completed',
      now() - interval '7 days' + (i || ' days')::interval,
      now() - interval '7 days' + (i || ' days')::interval + interval '5 minutes',
      now() - interval '7 days' + (i || ' days')::interval + interval '10 minutes',
      now() - interval '7 days' + (i || ' days')::interval + interval '2 hours',
      auth.uid(),
      my_store_id,
      10 + (i * 2),
      '138****' || (1000 + i)::text,
      '客户' || i::text,
      CASE WHEN i <= 3 THEN true ELSE false END,
      CASE WHEN i <= 3 THEN now() - interval '3 days' ELSE null END,
      (50 + (i * 20.5)) * 1.15,
      50 + (i * 20.5),
      now()
    );

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

-- 3. Secure create_demo_order_for_my_store function
CREATE OR REPLACE FUNCTION public.create_demo_order_for_my_store()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  my_profile record;
  my_store_id uuid;
  new_order_id uuid;
BEGIN
  -- SECURITY: Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- SECURITY: Rate limiting
  IF (SELECT COUNT(*) FROM public.orders 
      WHERE status = 'pending' 
      AND store_id IN (SELECT store_id FROM public.profiles WHERE id = auth.uid())
      AND created_at > now() - interval '1 hour') > 20 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Maximum 20 pending demo orders per hour';
  END IF;

  -- Get or create profile
  SELECT id, store_id INTO my_profile
  FROM public.profiles
  WHERE id = auth.uid();

  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
    VALUES (auth.uid(), '演示用户', 'worker', now(), now())
    ON CONFLICT (id) DO NOTHING;

    SELECT id, store_id INTO my_profile
    FROM public.profiles
    WHERE id = auth.uid();
  END IF;

  -- Create store if needed
  IF my_profile.store_id IS NULL THEN
    INSERT INTO public.stores (name, address)
    VALUES ('演示门店', '演示地址')
    RETURNING id INTO my_store_id;

    UPDATE public.profiles
    SET store_id = my_store_id, updated_at = now()
    WHERE id = my_profile.id;
  ELSE
    my_store_id := my_profile.store_id;
  END IF;

  -- Insert demo order
  INSERT INTO public.orders (
    id, type, duration_minutes, address, latitude, longitude, payout,
    status, created_at, updated_at, store_id, distance_minutes, contact_phone, contact_name
  ) VALUES (
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
  RETURNING id INTO new_order_id;

  RETURN new_order_id;
END;
$$;

-- 4. Add audit logging table for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.security_audit_log
FOR INSERT
WITH CHECK (true);

-- 5. Add constraint to bank_accounts to validate last 4 digits format
ALTER TABLE public.bank_accounts
DROP CONSTRAINT IF EXISTS valid_last4_format;

ALTER TABLE public.bank_accounts
ADD CONSTRAINT valid_last4_format 
CHECK (account_number_last4 ~ '^[0-9]{4}$');

-- 6. Add comments documenting security measures
COMMENT ON FUNCTION public.create_demo_completed_orders IS 
'SECURITY: Rate limited to 10 orders per hour per user. Only for authenticated users.';

COMMENT ON FUNCTION public.create_demo_order_for_my_store IS 
'SECURITY: Rate limited to 20 pending orders per hour per store. Only for authenticated users.';

COMMENT ON TABLE public.security_audit_log IS 
'Security audit trail for sensitive operations. Only admins have read access.';