import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Order {
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
  updated_at: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "获取订单失败",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimOrder = async (orderId: string) => {
    try {
      const { data, error } = await supabase.rpc('claim_order', {
        order_id: orderId
      });

      if (error) {
        toast({
          title: "抢单失败",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        toast({
          title: "抢单成功",
          description: "订单已分配给您，请及时开始服务",
        });
        fetchOrders(); // Refresh orders
        return true;
      } else {
        toast({
          title: "抢单失败",
          description: "该订单已被其他人抢走",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error claiming order:', error);
      toast({
        title: "抢单失败",
        description: "网络错误，请重试",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { data, error } = await supabase.rpc('update_order_status', {
        order_id: orderId,
        new_status: newStatus
      });

      if (error) {
        toast({
          title: "更新订单状态失败",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        toast({
          title: "订单状态已更新",
          description: `订单状态已更新为${newStatus === 'in_progress' ? '进行中' : '已完成'}`,
        });
        fetchOrders(); // Refresh orders
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  const createDemoOrder = async () => {
    try {
      const { data, error } = await supabase.rpc('create_demo_order_for_my_store');

      if (error) {
        toast({
          title: "创建演示订单失败",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "演示订单已创建",
        description: "新的演示订单已添加到任务大厅",
      });
      fetchOrders(); // Refresh to show new order
    } catch (error) {
      console.error('Error creating demo order:', error);
      toast({
        title: "创建演示订单失败",
        description: "网络错误，请重试",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change detected:', payload);
          fetchOrders(); // Refresh orders when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const myInProgressOrders = orders.filter(order => 
    order.status === 'in_progress' && order.assignee_id
  );
  const myCompletedOrders = orders.filter(order => 
    order.status === 'completed' && order.assignee_id
  );

  return {
    orders,
    pendingOrders,
    myInProgressOrders,
    myCompletedOrders,
    loading,
    fetchOrders,
    claimOrder,
    updateOrderStatus,
    createDemoOrder
  };
};