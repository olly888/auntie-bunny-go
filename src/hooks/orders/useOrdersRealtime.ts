
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
  
  // Additional state to track if we should show fallback broadcasts
  const [lastBroadcastTime, setLastBroadcastTime] = useState<number>(0);

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
            setLastBroadcastTime(Date.now());
            
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
  
  // Fallback broadcast every 30 seconds
  useEffect(() => {
    if (!profile) return;
    
    const fallbackInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastBroadcast = now - lastBroadcastTime;
      
      // Only show fallback if no broadcast in last 30 seconds and no current order showing
      if (timeSinceLastBroadcast >= 30000 && !newOrder) {
        // Check if user is online and has no current task
        const currentTaskData = queryClient.getQueryData(['current-task']);
        const taskHallData = queryClient.getQueryData(['task-hall-orders']) as Order[];
        const onlineStatus = queryClient.getQueryData(['online-status']);
        
        if (onlineStatus && !currentTaskData && taskHallData && taskHallData.length > 0) {
          // Pick a random order from first 3 available orders
          const availableOrders = taskHallData.slice(0, 3);
          const randomOrder = availableOrders[Math.floor(Math.random() * availableOrders.length)];
          
          const filteredOrder = {
            ...randomOrder,
            address: '区域订单',
            contact_phone: null,
            contact_name: null,
            latitude: null,
            longitude: null
          };
          
          setNewOrder(filteredOrder);
          setLastBroadcastTime(now);
          
          // Auto-hide after 10 seconds
          setTimeout(() => {
            setNewOrder(null);
          }, 10000);
        }
      }
    }, 30000);
    
    return () => {
      clearInterval(fallbackInterval);
    };
  }, [profile, queryClient, lastBroadcastTime, newOrder]);

  const dismissOrder = () => {
    setNewOrder(null);
  };

  return {
    newOrder,
    dismissOrder
  };
};
