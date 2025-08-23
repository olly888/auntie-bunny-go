
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from './useTaskHallOrders';

export const useCurrentTask = () => {
  return useQuery({
    queryKey: ['current-task'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // 未登录时返回 null
        return null;
      }

      // Use secure function to get orders
      const { data: allOrders, error } = await supabase
        .rpc('get_filtered_orders');
        
      if (error) throw error;
      
      // Find current task (assigned or in progress)
      const currentTask = (allOrders || []).find(order => 
        ['assigned', 'in_progress'].includes(order.status)
      ) || null;

      return currentTask as Order | null;
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
