import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from './useTaskHallOrders';

export const useCurrentTask = () => {
  return useQuery({
    queryKey: ['current-task'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, type, duration_minutes, address, payout, distance_minutes, status, created_at, assigned_at, started_at, completed_at, assignee_id')
        .in('status', ['assigned', 'in_progress'])
        .eq('assignee_id', (await supabase.auth.getUser()).data.user?.id!)
        .maybeSingle();

      if (error) throw error;
      return data as Order | null;
    },
    refetchInterval: 5000, // Check for current task every 5 seconds
  });
};

export const useUpdateOrderStatus = () => {
  return async (orderId: string, status: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('update_order_status', {
      order_id: orderId,
      new_status: status
    });

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return data as boolean;
  };
};