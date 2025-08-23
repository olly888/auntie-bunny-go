-- Remove insecure view and rely on secured RPC only
DROP VIEW IF EXISTS public.abnormal_orders;

-- Document access pattern
COMMENT ON FUNCTION public.get_abnormal_orders IS 'Use via RPC; enforces admin/manager role. View removed to avoid definer-privilege view exposure.';