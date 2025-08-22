-- Drop the existing view
DROP VIEW IF EXISTS public.abnormal_orders;

-- Recreate without SECURITY DEFINER (which is the default for views)
CREATE VIEW public.abnormal_orders AS
SELECT * FROM public.orders 
WHERE status = 'pending' 
AND created_at < now() - interval '30 seconds';