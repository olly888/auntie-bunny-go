-- Create storage bucket for order photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('order-photos', 'order-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for order photos bucket
CREATE POLICY "Workers can upload photos for their orders" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'order-photos' 
  AND EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id::text = (storage.foldername(name))[1] 
    AND orders.assignee_id = auth.uid()
  )
);

CREATE POLICY "Workers can view photos for their orders" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'order-photos' 
  AND EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id::text = (storage.foldername(name))[1] 
    AND orders.assignee_id = auth.uid()
  )
);