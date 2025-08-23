
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  contact_phone?: string | null;
  contact_name?: string | null;
  store_id?: string | null;
}

export const useOrdersRealtime = () => {
  const [newOrder, setNewOrder] = useState<Order | null>(null);
  const queryClient = useQueryClient();

  // Get current user's profile to check store_id and role
  const { data: profile } = useQuery({
    queryKey: ['current-profile'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('store_id, role')
        .eq('id', user.user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (!profile) return;

    console.log('Setting up realtime subscription for store:', profile.store_id);
    
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `store_id=eq.${profile.store_id}`
        },
        (payload) => {
          console.log('New order received:', payload);
          const order = payload.new as Order;
          
          // Only show broadcast for pending orders in the same store
          // Filter out sensitive customer data for broadcast
          if (order.status === 'pending' && order.store_id === profile.store_id) {
            const filteredOrder = {
              ...order,
              address: '区域订单', // Hide specific address
              contact_phone: null, // Hide customer phone
              contact_name: null,  // Hide customer name
              latitude: null,      // Hide precise location
              longitude: null
            };
            setNewOrder(filteredOrder);
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
              setNewOrder(null);
            }, 10000);
          }

          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['task-hall-orders'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [profile, queryClient]);

  const dismissOrder = () => {
    setNewOrder(null);
  };

  return {
    newOrder,
    dismissOrder
  };
};
