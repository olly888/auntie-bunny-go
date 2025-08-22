import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Order {
  id: string;
  type: string;
  duration_minutes: number;
  address: string;
  payout: number;
  distance_minutes: number | null;
  status: string;
  created_at: string;
  assigned_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  assignee_id?: string | null;
}

export const useTaskHallOrders = () => {
  return useQuery({
    queryKey: ['task-hall-orders'],
    queryFn: async () => {
      // Get orders that are pending and have been around for >10 seconds (missed the initial broadcast)
      const { data, error } = await supabase
        .from('orders')
        .select('id, type, duration_minutes, address, payout, distance_minutes, status, created_at')
        .eq('status', 'pending')
        .lt('created_at', new Date(Date.now() - 10000).toISOString()) // older than 10 seconds
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
  });
};

export const useClaimOrder = () => {
  return async (orderId: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('claim_order', {
      order_id: orderId
    });

    if (error) {
      console.error('Error claiming order:', error);
      throw error;
    }

    return data as boolean;
  };
};