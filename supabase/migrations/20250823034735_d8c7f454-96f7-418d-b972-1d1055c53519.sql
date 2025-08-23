-- Create security definer function to check if user has admin/manager role
-- This prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop the existing insecure view
DROP VIEW IF EXISTS public.abnormal_orders;

-- Create a secure version of abnormal_orders view with restricted access
-- Only admins and managers can access this sensitive customer data
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
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a secure view that uses the function
CREATE VIEW public.abnormal_orders AS 
SELECT * FROM public.get_abnormal_orders();

-- Add comment for security documentation
COMMENT ON VIEW public.abnormal_orders IS 'Secure view for abnormal orders - access restricted to admin/manager roles only';
COMMENT ON FUNCTION public.get_abnormal_orders() IS 'Security definer function to control access to sensitive customer data in abnormal orders';