-- Create orders table with complete order lifecycle
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- '洗碗兔', '客厅兔', etc.
  duration_minutes INTEGER NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  payout DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assignee_id UUID REFERENCES auth.users(id),
  store_id UUID REFERENCES public.stores(id),
  distance_minutes INTEGER, -- estimated travel time
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Workers can view pending orders (public fields)" 
ON public.orders 
FOR SELECT 
USING (
  status = 'pending' OR 
  (auth.uid() = assignee_id)
);

CREATE POLICY "Workers can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = assignee_id);

-- Create view for abnormal orders (pending > 30 seconds)
CREATE VIEW public.abnormal_orders AS
SELECT * FROM public.orders 
WHERE status = 'pending' 
AND created_at < now() - interval '30 seconds';

-- Create atomic order claiming RPC
CREATE OR REPLACE FUNCTION public.claim_order(order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Atomically claim the order if it's still pending
  UPDATE public.orders 
  SET 
    status = 'assigned',
    assignee_id = auth.uid(),
    assigned_at = now(),
    updated_at = now()
  WHERE 
    id = order_id 
    AND status = 'pending';
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Return true if we successfully claimed the order
  RETURN affected_rows > 0;
END;
$$;

-- Create function to update order status
CREATE OR REPLACE FUNCTION public.update_order_status(order_id UUID, new_status TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  affected_rows INTEGER;
  current_time TIMESTAMP WITH TIME ZONE := now();
BEGIN
  -- Update order status with appropriate timestamps
  UPDATE public.orders 
  SET 
    status = new_status,
    started_at = CASE WHEN new_status = 'in_progress' THEN current_time ELSE started_at END,
    completed_at = CASE WHEN new_status = 'completed' THEN current_time ELSE completed_at END,
    updated_at = current_time
  WHERE 
    id = order_id 
    AND assignee_id = auth.uid();
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  RETURN affected_rows > 0;
END;
$$;

-- Create order_photos table for service completion photos
CREATE TABLE public.order_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for order_photos
ALTER TABLE public.order_photos ENABLE ROW LEVEL SECURITY;

-- Policy for order photos
CREATE POLICY "Workers can manage photos for their orders" 
ON public.order_photos 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_photos.order_id 
    AND orders.assignee_id = auth.uid()
  )
);

-- Add updated_at trigger for orders
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Enable realtime for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Insert some demo orders for testing
INSERT INTO public.orders (type, duration_minutes, address, payout, distance_minutes, latitude, longitude) VALUES
('洗碗兔', 30, '深圳市南山区科技园A区12栋', 12.00, 5, 22.5431, 113.9342),
('客厅兔', 60, '深圳市福田区中心城B座', 24.00, 8, 22.5311, 114.1191),
('厨房兔', 45, '深圳市宝安区西乡街道C小区', 18.00, 12, 22.5511, 113.8281),
('全屋兔', 120, '深圳市龙华区民治街道D花园', 48.00, 15, 22.6419, 114.0242);