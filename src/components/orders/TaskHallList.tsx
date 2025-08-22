import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCard } from "./OrderCard";
import { useTaskHallOrders, useClaimOrder } from "@/hooks/orders/useTaskHallOrders";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function TaskHallList() {
  const { data: orders = [], isLoading, refetch } = useTaskHallOrders();
  const claimOrder = useClaimOrder();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [claimingOrderId, setClaimingOrderId] = useState<string | null>(null);

  const handleClaimOrder = async (orderId: string) => {
    setClaimingOrderId(orderId);
    try {
      const success = await claimOrder(orderId);
      
      if (success) {
        toast({
          title: "抢单成功！",
          description: "正在跳转到订单详情页面...",
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['task-hall-orders'] });
        queryClient.invalidateQueries({ queryKey: ['current-task'] });
        
        // Navigate to order service page
        navigate('/order-service');
      } else {
        toast({
          title: "手慢了！",
          description: "订单已被其他阿姨抢走",
          variant: "destructive"
        });
        // Refresh the orders list
        refetch();
      }
    } catch (error) {
      console.error('Failed to claim order:', error);
      toast({
        title: "抢单失败",
        description: "网络错误，请重试",
        variant: "destructive"
      });
    } finally {
      setClaimingOrderId(null);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          任务大厅 ({orders.length}个新订单)
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {isLoading && orders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          加载中...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          暂无可接订单
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onClaim={handleClaimOrder}
              isLoading={claimingOrderId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}