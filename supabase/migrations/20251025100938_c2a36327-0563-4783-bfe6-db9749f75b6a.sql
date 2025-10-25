-- ============================================================================
-- SECURITY FIX: Address Warn-Level Security Issues (v2)
-- ============================================================================

-- ============================================================================
-- FIX 1: Restrict Stores Table Access
-- ============================================================================

-- Remove any existing policies on stores
DROP POLICY IF EXISTS "Anyone can read stores" ON public.stores;
DROP POLICY IF EXISTS "Authenticated users can view stores" ON public.stores;
DROP POLICY IF EXISTS "Admins can manage stores" ON public.stores;

-- Only authenticated users can view stores
CREATE POLICY "Authenticated users can view stores"
ON public.stores FOR SELECT
TO authenticated
USING (true);

-- Admins can manage stores
CREATE POLICY "Admins can manage stores"
ON public.stores FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ============================================================================
-- FIX 2: Update get_current_user_role to Use Secure user_roles Table
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'manager' THEN 2
      WHEN 'worker' THEN 3
    END
  LIMIT 1
$$;

-- ============================================================================
-- FIX 3: Add Referral Events RLS Policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can create referral events" ON public.referral_events;
DROP POLICY IF EXISTS "Users can view own referral events" ON public.referral_events;
DROP POLICY IF EXISTS "Admins can view all referral events" ON public.referral_events;

CREATE POLICY "Users can create referral events"
ON public.referral_events FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.referrals r
    WHERE r.id = referral_events.referral_id
    AND r.inviter_id = auth.uid()
  )
);

CREATE POLICY "Users can view own referral events"
ON public.referral_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.referrals r
    WHERE r.id = referral_events.referral_id
    AND r.inviter_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all referral events"
ON public.referral_events FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));