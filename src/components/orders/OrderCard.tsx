import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Order } from "@/hooks/orders/useTaskHallOrders";
import { OrderCountdown } from "./OrderCountdown";
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface OrderCardProps {
  order: Order;
  onClaim: (orderId: string) => void;
  isLoading?: boolean;
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

export function OrderCard({ order, onClaim, isLoading }: OrderCardProps) {
  const icon = getOrderIcon(order.type);
  const distanceText = order.distance_minutes ? `距您${order.distance_minutes}分钟` : '位置待定';
  const createdTime = formatDistanceToNow(new Date(order.created_at), { 
    locale: zhCN, 
    addSuffix: true 
  });

  return (
    <Card className="p-4 border border-border bg-card">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-card-foreground">
              {icon} {order.type} | {order.duration_minutes}分钟
            </span>
            <span className="text-lg font-bold text-destructive">
              ¥{order.payout.toFixed(1)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            📍 {order.address} ({distanceText})
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>下单时间: {createdTime}</span>
            <OrderCountdown createdAt={order.created_at} />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={() => onClaim(order.id)}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
      >
        {isLoading ? '抢单中...' : '抢单'}
      </Button>
    </Card>
  );
}