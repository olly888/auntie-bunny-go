import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  type: string;
  duration_minutes: number;
  address: string;
  latitude?: number;
  longitude?: number;
  payout: number;
  status: string;
  created_at: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
  assignee_id?: string;
  contact_phone?: string;
  contact_name?: string;
  store_id?: string;
  distance_minutes?: number;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create demo order
  const createDemoOrder = async () => {
    try {
      const { data, error } = await supabase.rpc('create_demo_order_for_my_store');
      
      if (error) {
        console.error('Error creating demo order:', error);
        toast({
          title: "创建演示订单失败",
          description: "请稍后重试",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "演示订单已创建",
        description: "请到任务大厅查看新订单"
      });
      
      await fetchOrders();
      return data;
    } catch (error) {
      console.error('Error creating demo order:', error);
      toast({
        title: "创建演示订单失败",
        description: "请稍后重试",
        variant: "destructive"
      });
      return null;
    }
  };

  // Claim order
  const claimOrder = async (orderId: string) => {
    try {
      const { data, error } = await supabase.rpc('claim_order', { order_id: orderId });
      
      if (error) {
        console.error('Error claiming order:', error);
        toast({
          title: "抢单失败",
          description: "订单可能已被其他人抢走",
          variant: "destructive"
        });
        return false;
      }

      if (data) {
        toast({
          title: "抢单成功！",
          description: "请前往订单详情开始工作"
        });
        await fetchOrders();
        return true;
      } else {
        toast({
          title: "抢单失败",
          description: "订单已被其他人抢走",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error claiming order:', error);
      toast({
        title: "抢单失败",
        description: "请稍后重试",
        variant: "destructive"
      });
      return false;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { data, error } = await supabase.rpc('update_order_status', {
        order_id: orderId,
        new_status: newStatus
      });
      
      if (error) {
        console.error('Error updating order status:', error);
        return false;
      }

      if (data) {
        await fetchOrders();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Initial fetch
  useEffect(() => {
    if (currentUserId) {
      fetchOrders();
    }
  }, [currentUserId]);

  // Filter orders by type
  const hallOrders = orders.filter(order => order.status === 'pending');
  const inProgressOrders = orders.filter(order => 
    order.status === 'assigned' || order.status === 'in_progress'
  );
  const completedOrders = orders.filter(order => order.status === 'completed');
  const myInProgressOrders = inProgressOrders.filter(order => order.assignee_id === currentUserId);
  const myCompletedOrders = completedOrders.filter(order => order.assignee_id === currentUserId);

  return {
    orders,
    hallOrders,
    inProgressOrders: myInProgressOrders,
    completedOrders: myCompletedOrders,
    loading,
    currentUserId,
    fetchOrders,
    createDemoOrder,
    claimOrder,
    updateOrderStatus
  };
};