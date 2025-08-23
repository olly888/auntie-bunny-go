-- Add contact information to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_name TEXT;

-- Create customer_notes table for cross-order shared notes
CREATE TABLE IF NOT EXISTS public.customer_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID,
  customer_phone TEXT NOT NULL,
  order_id UUID NOT NULL REFERENCES public.orders(id),
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on customer_notes
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for customer_notes
CREATE POLICY "Workers can read customer notes in same store" 
ON public.customer_notes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p1, public.profiles p2
    WHERE p1.id = auth.uid() 
    AND p2.id = customer_notes.author_id
    AND p1.store_id = p2.store_id
    AND p1.store_id IS NOT NULL
  )
);

CREATE POLICY "Workers can create notes for assigned orders" 
ON public.customer_notes 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = customer_notes.order_id 
    AND orders.assignee_id = auth.uid()
  )
  AND auth.uid() = author_id
);

CREATE POLICY "Authors can update own notes" 
ON public.customer_notes 
FOR UPDATE 
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own notes" 
ON public.customer_notes 
FOR DELETE 
USING (auth.uid() = author_id);

-- Create storage bucket for order photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('order-photos', 'order-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for order photos
CREATE POLICY "Workers can view order photos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'order-photos' 
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE (storage.foldername(name))[1] = o.id::text
    AND o.assignee_id = auth.uid()
  )
);

CREATE POLICY "Workers can upload photos for assigned orders" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'order-photos'
  AND EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id::text = (storage.foldername(name))[1]
    AND orders.assignee_id = auth.uid()
  )
);

-- Add trigger for customer_notes updated_at
DROP TRIGGER IF EXISTS update_customer_notes_updated_at ON public.customer_notes;
CREATE TRIGGER update_customer_notes_updated_at
BEFORE UPDATE ON public.customer_notes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();