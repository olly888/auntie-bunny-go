-- Fix Security Definer View issue for onboarding_funnel
-- The view should use SECURITY INVOKER to enforce RLS policies of the querying user

DROP VIEW IF EXISTS public.onboarding_funnel;

-- Recreate view with SECURITY INVOKER (explicitly set)
-- This ensures the view respects the RLS policies of the querying user, not the view creator
CREATE OR REPLACE VIEW public.onboarding_funnel
WITH (security_invoker = true) AS
SELECT
  COUNT(*) FILTER (WHERE onboarding_status = 'registered') as registered_count,
  COUNT(*) FILTER (WHERE is_id_verified = true) as id_verified_count,
  COUNT(*) FILTER (WHERE is_training_completed = true) as training_completed_count,
  COUNT(*) FILTER (WHERE onboarding_status = 'activated') as activated_count,
  ROUND(
    COUNT(*) FILTER (WHERE onboarding_status = 'activated')::numeric / 
    NULLIF(COUNT(*) FILTER (WHERE onboarding_status = 'registered'), 0) * 100,
    2
  ) as activation_rate_percent
FROM public.profiles;