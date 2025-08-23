-- Add contact information to orders table
ALTER TABLE public.orders 
ADD COLUMN contact_phone TEXT,
ADD COLUMN contact_name TEXT;

-- Create customer_notes table for cross-order shared notes
CREATE TABLE public.customer_notes (
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
-- Workers in same store can read notes for same customer
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

-- Workers can insert notes for their assigned orders
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

-- Authors can update their own notes
CREATE POLICY "Authors can update own notes" 
ON public.customer_notes 
FOR UPDATE 
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Authors can delete their own notes
CREATE POLICY "Authors can delete own notes" 
ON public.customer_notes 
FOR DELETE 
USING (auth.uid() = author_id);

-- Create storage bucket for order photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('order-photos', 'order-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for order photos
CREATE POLICY "Workers can view order photos in same store" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'order-photos' 
  AND EXISTS (
    SELECT 1 FROM public.order_photos op, public.orders o, public.profiles p1, public.profiles p2
    WHERE storage.foldername(name) = op.order_id::text
    AND op.order_id = o.id
    AND o.assignee_id = p2.id
    AND p1.id = auth.uid()
    AND p1.store_id = p2.store_id
    AND p1.store_id IS NOT NULL
  )
);

-- Workers can upload photos for their assigned orders  
CREATE POLICY "Workers can upload photos for assigned orders" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'order-photos'
  AND EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id::text = storage.foldername(name)
    AND orders.assignee_id = auth.uid()
  )
);

-- Add trigger for customer_notes updated_at
CREATE TRIGGER update_customer_notes_updated_at
BEFORE UPDATE ON public.customer_notes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();