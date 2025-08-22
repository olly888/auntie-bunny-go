import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from './useTaskHallOrders';

export const useOrdersRealtime = (isOnline: boolean) => {
  const [newOrder, setNewOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isOnline) return;

    console.log('Setting up realtime subscription for new orders...');
    
    const channel = supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: 'status=eq.pending'
        },
        (payload) => {
          console.log('New order received:', payload);
          const order = payload.new as Order;
          setNewOrder(order);
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [isOnline]);

  const clearNewOrder = () => {
    setNewOrder(null);
  };

  return { newOrder, clearNewOrder };
};