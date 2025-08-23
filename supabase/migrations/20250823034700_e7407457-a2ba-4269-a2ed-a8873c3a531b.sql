-- Enable RLS on abnormal_orders table to protect sensitive customer data
ALTER TABLE public.abnormal_orders ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has admin/manager role
-- This prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Policy 1: Only admins and managers can view abnormal orders with sensitive data
-- This protects customer phone numbers, addresses, and location data
CREATE POLICY "Only admins and managers can view abnormal orders"
ON public.abnormal_orders
FOR SELECT
USING (
  public.get_current_user_role() IN ('admin', 'manager')
);

-- Policy 2: Only admins can modify abnormal orders (if table supports updates)
CREATE POLICY "Only admins can modify abnormal orders"
ON public.abnormal_orders
FOR ALL
USING (
  public.get_current_user_role() = 'admin'
);

-- Add comment for security documentation
COMMENT ON TABLE public.abnormal_orders IS 'Contains sensitive customer data - access restricted to authorized personnel only';