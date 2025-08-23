
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
  contact_phone?: string | null;
  contact_name?: string | null;
  store_id?: string | null;
}

export const useTaskHallOrders = () => {
  return useQuery({
    queryKey: ['task-hall-orders'],
    queryFn: async () => {
      // Get current user's profile to filter by store
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data: profile } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.store_id) return [];

      // Get orders that are pending, in the same store, and have been around for >10 seconds
      const { data, error } = await supabase
        .from('orders')
        .select('id, type, duration_minutes, address, payout, distance_minutes, status, created_at, store_id')
        .eq('status', 'pending')
        .eq('store_id', profile.store_id)
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
