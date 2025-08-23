
import React, { useState } from 'react';
import { OrderCard } from './OrderCard';
import { useTaskHallOrders, useClaimOrder } from '@/hooks/orders/useTaskHallOrders';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function TaskHallList() {
  const { data: orders = [], isLoading: isLoadingOrders } = useTaskHallOrders();
  const claimOrder = useClaimOrder();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [claimingOrderId, setClaimingOrderId] = useState<string | null>(null);

  const handleClaimOrder = async (orderId: string) => {
    setClaimingOrderId(orderId);
    
    try {
      const success = await claimOrder(orderId);
      if (success) {
        toast({
          title: "抢单成功！",
          description: "订单已分配给您，正在跳转到服务页面"
        });
        
        // Invalidate queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: ['current-task'] });
        queryClient.invalidateQueries({ queryKey: ['task-hall-orders'] });
        
        // Navigate to order service page
        navigate(`/order-service/${orderId}`);
      } else {
        toast({
          title: "抢单失败",
          description: "订单已被其他阿姨抢走",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error claiming order:', error);
      toast({
        title: "抢单失败",
        description: "网络错误，请重试",
        variant: "destructive"
      });
    } finally {
      setClaimingOrderId(null);
    }
  };

  if (isLoadingOrders) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">暂无待抢订单</p>
        <p className="text-sm text-gray-400 mt-1">新订单会自动出现在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onClaim={handleClaimOrder}
          isLoading={claimingOrderId === order.id}
        />
      ))}
    </div>
  );
}
