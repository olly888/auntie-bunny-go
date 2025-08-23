-- Fix search path security warnings for all functions
-- This prevents potential security issues with function search paths

-- Update get_current_user_role function with secure search path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Update get_abnormal_orders function with secure search path  
CREATE OR REPLACE FUNCTION public.get_abnormal_orders()
RETURNS TABLE (
  id uuid,
  type text,
  duration_minutes integer,
  address text,
  latitude numeric,
  longitude numeric,
  payout numeric,
  status text,
  created_at timestamp with time zone,
  assigned_at timestamp with time zone,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  assignee_id uuid,
  contact_phone text,
  contact_name text,
  store_id uuid,
  distance_minutes integer,
  updated_at timestamp with time zone
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Security check: Only allow admins and managers to access sensitive data
  IF public.get_current_user_role() NOT IN ('admin', 'manager') THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges to view abnormal orders';
  END IF;
  
  -- Return abnormal orders (pending > 30 seconds) with all sensitive data
  RETURN QUERY
  SELECT o.id, o.type, o.duration_minutes, o.address, o.latitude, o.longitude, 
         o.payout, o.status, o.created_at, o.assigned_at, o.started_at, 
         o.completed_at, o.assignee_id, o.contact_phone, o.contact_name,
         o.store_id, o.distance_minutes, o.updated_at
  FROM public.orders o
  WHERE o.status = 'pending' 
    AND o.created_at < (now() - interval '30 seconds');
END;
$$;

-- Update claim_order function with secure search path
CREATE OR REPLACE FUNCTION public.claim_order(order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Atomically claim the order if it's still pending
  UPDATE public.orders 
  SET 
    status = 'assigned',
    assignee_id = auth.uid(),
    assigned_at = now(),
    updated_at = now()
  WHERE 
    id = order_id 
    AND status = 'pending';
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Return true if we successfully claimed the order
  RETURN affected_rows > 0;
END;
$$;

-- Update update_order_status function with secure search path
CREATE OR REPLACE FUNCTION public.update_order_status(order_id uuid, new_status text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_rows INTEGER;
  current_time TIMESTAMP WITH TIME ZONE := now();
BEGIN
  -- Update order status with appropriate timestamps
  UPDATE public.orders 
  SET 
    status = new_status,
    started_at = CASE WHEN new_status = 'in_progress' THEN current_time ELSE started_at END,
    completed_at = CASE WHEN new_status = 'completed' THEN current_time ELSE completed_at END,
    updated_at = current_time
  WHERE 
    id = order_id 
    AND assignee_id = auth.uid();
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  RETURN affected_rows > 0;
END;
$$;