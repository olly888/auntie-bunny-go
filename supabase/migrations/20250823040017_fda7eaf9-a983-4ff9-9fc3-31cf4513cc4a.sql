-- Create secure function to get orders with proper field filtering
-- Only assigned workers can see sensitive customer contact information
CREATE OR REPLACE FUNCTION public.get_filtered_orders()
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
  RETURN QUERY
  SELECT 
    o.id, 
    o.type, 
    o.duration_minutes, 
    -- Only show address to assigned workers, otherwise show generic location
    CASE WHEN o.assignee_id = auth.uid() OR o.status != 'pending' THEN o.address ELSE '区域订单' END as address,
    -- Hide precise coordinates for unassigned pending orders
    CASE WHEN o.assignee_id = auth.uid() OR o.status != 'pending' THEN o.latitude ELSE null END as latitude,
    CASE WHEN o.assignee_id = auth.uid() OR o.status != 'pending' THEN o.longitude ELSE null END as longitude,
    o.payout, 
    o.status, 
    o.created_at, 
    o.assigned_at, 
    o.started_at, 
    o.completed_at, 
    o.assignee_id,
    -- Only show contact info to assigned workers
    CASE WHEN o.assignee_id = auth.uid() THEN o.contact_phone ELSE null END as contact_phone,
    CASE WHEN o.assignee_id = auth.uid() THEN o.contact_name ELSE null END as contact_name,
    o.store_id, 
    o.distance_minutes, 
    o.updated_at
  FROM public.orders o
  WHERE 
    -- User can see pending orders in their store OR orders assigned to them
    (o.status = 'pending' AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.store_id = o.store_id
    )) OR 
    o.assignee_id = auth.uid();
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;

-- Update the restrictive RLS policy on orders to be more secure
-- Remove the overly permissive policy that exposes sensitive data
DROP POLICY IF EXISTS "Workers can view pending orders (public fields)" ON public.orders;

-- Create new restrictive policy - only assigned workers get full access
CREATE POLICY "Workers can only see assigned orders with full details"
ON public.orders
FOR SELECT
USING (auth.uid() = assignee_id);

-- Create policy for pending orders - limited access through function only
CREATE POLICY "Workers can update their assigned orders only"
ON public.orders
FOR UPDATE
USING (auth.uid() = assignee_id);

-- Document the secure access pattern
COMMENT ON FUNCTION public.get_filtered_orders() IS 'Secure access to orders - filters sensitive customer data based on assignment status. Use this instead of direct table access.';