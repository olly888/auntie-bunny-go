
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

      // Get filtered orders using secure RPC function
      const { data, error } = await supabase
        .rpc('get_filtered_orders');

      if (error) throw error;
      
      // Filter to only include pending orders older than 10 seconds for task hall
      const taskHallOrders = (data || []).filter(order => 
        order.status === 'pending' && 
        order.store_id === profile.store_id &&
        new Date(order.created_at).getTime() < Date.now() - 10000
      ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      return taskHallOrders as Order[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
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
