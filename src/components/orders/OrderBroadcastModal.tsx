import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Order } from "@/hooks/orders/useTaskHallOrders";
import { useClaimOrder } from "@/hooks/orders/useTaskHallOrders";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface OrderBroadcastModalProps {
  order: Order | null;
  onClose: () => void;
}

const getOrderIcon = (type: string) => {
  switch (type) {
    case '洗碗兔': return '🐰';
    case '客厅兔': return '🛋️';
    case '厨房兔': return '🍳';
    case '全屋兔': return '🏠';
    default: return '🐰';
  }
};

export function OrderBroadcastModal({ order, onClose }: OrderBroadcastModalProps) {
  const [countdown, setCountdown] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const claimOrder = useClaimOrder();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (order) {
      setIsOpen(true);
      setCountdown(10);
    }
  }, [order]);

  useEffect(() => {
    if (!isOpen || !order) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsOpen(false);
          setTimeout(onClose, 300); // Allow animation to complete
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, order, onClose]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const handleClaimOrder = async () => {
    if (!order) return;
    
    setIsLoading(true);
    try {
      const success = await claimOrder(order.id);
      
      if (success) {
        toast({
          title: "抢单成功！",
          description: "正在跳转到订单详情页面...",
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['task-hall-orders'] });
        queryClient.invalidateQueries({ queryKey: ['current-task'] });
        
        handleClose();
        navigate('/order-service');
      } else {
        toast({
          title: "手慢了！",
          description: "订单已被其他阿姨抢走",
          variant: "destructive"
        });
        handleClose();
      }
    } catch (error) {
      console.error('Failed to claim order:', error);
      toast({
        title: "抢单失败",
        description: "网络错误，请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) return null;

  const icon = getOrderIcon(order.type);
  const distanceText = order.distance_minutes ? `距您${order.distance_minutes}分钟` : '位置待定';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-xl bg-background border-2 border-primary/20">
        <div className="text-center space-y-6 p-2">
          {/* Bell Icon with Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <Bell className="w-12 h-12 text-primary animate-bounce" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-pulse" />
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">新订单来了！</h2>
            
            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-foreground">
                  {icon} {order.type}
                </span>
                <span className="text-2xl font-bold text-destructive">
                  ¥{order.payout.toFixed(1)}
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                ⏱️ 预计{order.duration_minutes}分钟
              </div>
              
              <div className="text-sm text-muted-foreground">
                📍 {order.address}
              </div>
              
              <div className="text-sm text-muted-foreground">
                🚗 {distanceText}
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {countdown}
            </div>
            <div className="text-sm text-muted-foreground">
              秒后自动关闭
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleClaimOrder}
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? '抢单中...' : '立即抢单'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}