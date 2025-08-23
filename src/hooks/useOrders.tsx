import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Order = Database['public']['Tables']['orders']['Row'];

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 获取订单数据
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "获取订单失败",
        description: "请检查网络连接或稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 抢单
  const claimOrder = async (orderId: string) => {
    try {
      const { error } = await supabase.rpc('claim_order', { 
        order_id: orderId 
      });

      if (error) throw error;

      toast({
        title: "抢单成功！",
        description: "订单已分配给您，请及时开始服务",
      });

      // 重新获取订单列表
      await fetchOrders();
      return true;
    } catch (error) {
      console.error('Error claiming order:', error);
      toast({
        title: "抢单失败",
        description: "订单可能已被其他人抢走",
        variant: "destructive",
      });
      return false;
    }
  };

  // 更新订单状态
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase.rpc('update_order_status', {
        order_id: orderId,
        new_status: status
      });

      if (error) throw error;

      toast({
        title: "状态更新成功",
        description: `订单状态已更新为：${status}`,
      });

      await fetchOrders();
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "状态更新失败",
        description: "请稍后重试",
        variant: "destructive",
      });
      return false;
    }
  };

  // 创建演示订单
  const createDemoOrder = async () => {
    try {
      const { data, error } = await supabase.rpc('create_demo_order_for_my_store');

      if (error) throw error;

      toast({
        title: "演示订单创建成功",
        description: "可以在任务大厅中看到新订单",
      });

      await fetchOrders();
      return data;
    } catch (error) {
      console.error('Error creating demo order:', error);
      toast({
        title: "创建演示订单失败",
        description: "请稍后重试",
        variant: "destructive",
      });
      return null;
    }
  };

  // 设置实时监听
  useEffect(() => {
    fetchOrders();

    // 监听订单变化
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
  }, []);

  // 过滤不同状态的订单
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const inProgressOrders = orders.filter(order => order.status === 'in_progress');
  const assignedOrders = orders.filter(order => order.status === 'assigned');
  const completedOrders = orders.filter(order => order.status === 'completed');

  // 当前用户的订单（已分配或进行中）
  const myActiveOrders = [...assignedOrders, ...inProgressOrders];

  return {
    orders,
    loading,
    pendingOrders,
    inProgressOrders,
    assignedOrders,
    completedOrders,
    myActiveOrders,
    claimOrder,
    updateOrderStatus,
    createDemoOrder,
    refetch: fetchOrders
  };
}