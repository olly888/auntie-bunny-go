-- ============================================================================
-- Add Handwritten Signature Support for Electronic Contracts
-- ============================================================================

-- Add signature columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS signature_url TEXT,
ADD COLUMN IF NOT EXISTS signature_device TEXT,
ADD COLUMN IF NOT EXISTS signature_fingerprint TEXT;

-- Create storage bucket for signatures
INSERT INTO storage.buckets (id, name, public)
VALUES ('signatures', 'signatures', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for signatures bucket
CREATE POLICY "Users can upload own signatures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'signatures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own signatures"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'signatures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own signatures"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'signatures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own signatures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'signatures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);