-- ============================================================================
-- SECURITY FIX MIGRATION: Address Critical Security Issues
-- ============================================================================
-- This migration fixes:
-- 1. Role-based access control (move roles to separate table)
-- 2. Security definer functions missing search_path
-- 3. Recruit applications RLS policies
-- ============================================================================

-- ============================================================================
-- PART 1: Create Role-Based Access Control System
-- ============================================================================

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'worker');

-- Create dedicated roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can manage user roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

-- ============================================================================
-- PART 2: Create Security Definer Function for Role Checks
-- ============================================================================

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper function for current user's role (for backward compatibility)
CREATE OR REPLACE FUNCTION public.get_current_user_role_secure()
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
-- PART 3: Migrate Existing Roles from Profiles Table
-- ============================================================================

-- Migrate existing role data to user_roles table
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT 
  id,
  CASE 
    WHEN role = 'admin' THEN 'admin'::app_role
    WHEN role = 'manager' THEN 'manager'::app_role
    ELSE 'worker'::app_role
  END,
  created_at
FROM public.profiles
WHERE id IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================================
-- PART 4: Update All RLS Policies to Use New Role System
-- ============================================================================

-- Update profiles table policies
DROP POLICY IF EXISTS "Admins and managers can view all profiles" ON public.profiles;
CREATE POLICY "Admins and managers can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can update own profile (except role)" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Update provider_certifications policies
DROP POLICY IF EXISTS "Admins and managers can view all certifications" ON public.provider_certifications;
CREATE POLICY "Admins and managers can view all certifications"
ON public.provider_certifications FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins and managers can insert certifications" ON public.provider_certifications;
CREATE POLICY "Admins and managers can insert certifications"
ON public.provider_certifications FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins and managers can update certifications" ON public.provider_certifications;
CREATE POLICY "Admins and managers can update certifications"
ON public.provider_certifications FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins and managers can delete certifications" ON public.provider_certifications;
CREATE POLICY "Admins and managers can delete certifications"
ON public.provider_certifications FOR DELETE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Update recruit_applications policies
DROP POLICY IF EXISTS "Admins and managers can view applications" ON public.recruit_applications;
CREATE POLICY "Admins and managers can view applications"
ON public.recruit_applications FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins and managers can update applications" ON public.recruit_applications;
CREATE POLICY "Admins and managers can update applications"
ON public.recruit_applications FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Update orders policies
DROP POLICY IF EXISTS "Admins can view all order financial data" ON public.orders;
CREATE POLICY "Admins can view all order financial data"
ON public.orders FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins can update order financial data" ON public.orders;
CREATE POLICY "Admins can update order financial data"
ON public.orders FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Update notification_receipts policies
DROP POLICY IF EXISTS "Admins can view all receipts" ON public.notification_receipts;
CREATE POLICY "Admins can view all receipts"
ON public.notification_receipts FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Update notifications policies
DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;
CREATE POLICY "Admins can manage notifications"
ON public.notifications FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Update payroll_adjustments policies
DROP POLICY IF EXISTS "Admins and managers can view payroll adjustments" ON public.payroll_adjustments;
CREATE POLICY "Admins and managers can view payroll adjustments"
ON public.payroll_adjustments FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins and managers can insert payroll adjustments" ON public.payroll_adjustments;
CREATE POLICY "Admins and managers can insert payroll adjustments"
ON public.payroll_adjustments FOR INSERT
WITH CHECK ((has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) AND auth.uid() = created_by);

DROP POLICY IF EXISTS "Admins and managers can update payroll adjustments" ON public.payroll_adjustments;
CREATE POLICY "Admins and managers can update payroll adjustments"
ON public.payroll_adjustments FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Update settlement_configs policies
DROP POLICY IF EXISTS "Admins and managers can view settlement configs" ON public.settlement_configs;
CREATE POLICY "Admins and managers can view settlement configs"
ON public.settlement_configs FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins and managers can insert settlement configs" ON public.settlement_configs;
CREATE POLICY "Admins and managers can insert settlement configs"
ON public.settlement_configs FOR INSERT
WITH CHECK ((has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) AND created_by = auth.uid());

DROP POLICY IF EXISTS "Admins and managers can update settlement configs" ON public.settlement_configs;
CREATE POLICY "Admins and managers can update settlement configs"
ON public.settlement_configs FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
WITH CHECK ((has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) AND updated_by = auth.uid());

DROP POLICY IF EXISTS "Admins and managers can delete settlement configs" ON public.settlement_configs;
CREATE POLICY "Admins and managers can delete settlement configs"
ON public.settlement_configs FOR DELETE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Update ui_permissions policies
DROP POLICY IF EXISTS "Admins and managers can manage ui_permissions" ON public.ui_permissions;
CREATE POLICY "Admins and managers can manage ui_permissions"
ON public.ui_permissions FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
WITH CHECK ((has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) AND auth.uid() = updated_by);

-- Update appeal_tickets policies
DROP POLICY IF EXISTS "Admins can view all appeals" ON public.appeal_tickets;
CREATE POLICY "Admins can view all appeals"
ON public.appeal_tickets FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins can update appeals" ON public.appeal_tickets;
CREATE POLICY "Admins can update appeals"
ON public.appeal_tickets FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- ============================================================================
-- PART 5: Fix All Security Definer Functions - Add SET search_path
-- ============================================================================

-- Fix get_current_user_role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Fix admin_search_profiles
CREATE OR REPLACE FUNCTION public.admin_search_profiles(search_term TEXT)
RETURNS TABLE(
  id UUID, 
  full_name TEXT, 
  phone TEXT, 
  role TEXT, 
  store_id UUID, 
  created_at TIMESTAMPTZ, 
  updated_at TIMESTAMPTZ, 
  store_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.role,
    p.store_id,
    p.created_at,
    p.updated_at,
    s.name as store_name
  FROM public.profiles p
  LEFT JOIN public.stores s ON p.store_id = s.id
  WHERE 
    (search_term IS NULL OR search_term = '' OR
     p.full_name ILIKE '%' || search_term || '%' OR
     p.phone ILIKE '%' || search_term || '%')
  ORDER BY p.updated_at DESC
  LIMIT 100;
END;
$$;

-- Fix get_abnormal_orders
CREATE OR REPLACE FUNCTION public.get_abnormal_orders()
RETURNS TABLE(
  id UUID, type TEXT, duration_minutes INTEGER, address TEXT, 
  latitude NUMERIC, longitude NUMERIC, payout NUMERIC, status TEXT, 
  created_at TIMESTAMPTZ, assigned_at TIMESTAMPTZ, started_at TIMESTAMPTZ, 
  completed_at TIMESTAMPTZ, assignee_id UUID, contact_phone TEXT, 
  contact_name TEXT, store_id UUID, distance_minutes INTEGER, 
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager')) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges';
  END IF;
  
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

-- Note: All other functions already have SET search_path = public
-- (verified from the db-functions list provided)