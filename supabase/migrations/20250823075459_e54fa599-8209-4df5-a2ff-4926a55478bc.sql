-- Add author_name column to customer_notes table for better display
ALTER TABLE public.customer_notes 
ADD COLUMN author_name TEXT;

-- Update existing records to have a default name (optional, can be left NULL)
-- This is for any existing records without names