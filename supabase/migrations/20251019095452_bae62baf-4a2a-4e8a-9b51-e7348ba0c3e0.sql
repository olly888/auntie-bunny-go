-- Fix recruitment form spam vulnerability with IP-based rate limiting
-- Add IP address tracking for rate limiting
ALTER TABLE recruit_applications
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT now();

-- Create rate limiting function (max 3 submissions per IP per day)
CREATE OR REPLACE FUNCTION check_recruitment_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow max 3 submissions per IP per day
  IF NEW.ip_address IS NOT NULL AND (
    SELECT COUNT(*) 
    FROM recruit_applications 
    WHERE ip_address = NEW.ip_address 
    AND created_at > now() - interval '1 day'
  ) >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum 3 applications per day.';
  END IF;
  
  -- Set submitted_at if not already set
  IF NEW.submitted_at IS NULL THEN
    NEW.submitted_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce rate limiting
DROP TRIGGER IF EXISTS enforce_recruitment_rate_limit ON recruit_applications;
CREATE TRIGGER enforce_recruitment_rate_limit
BEFORE INSERT ON recruit_applications
FOR EACH ROW
EXECUTE FUNCTION check_recruitment_rate_limit();

-- Add index for better rate limit query performance
CREATE INDEX IF NOT EXISTS idx_recruit_applications_ip_created 
ON recruit_applications(ip_address, created_at) 
WHERE ip_address IS NOT NULL;