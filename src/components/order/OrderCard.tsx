import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign } from "lucide-react";

interface Order {
  id: string;
  type: string;
  duration_minutes: number;
  address: string;
  payout: number;
  status: string;
  created_at: string;
  distance_minutes?: number;
}

interface OrderCardProps {
  order: Order;
  onClaim?: (orderId: string) => void;
  onViewDetails?: (orderId: string) => void;
  showActions?: boolean;
  isClaimable?: boolean;
}

export const OrderCard = ({ 
  order, 
  onClaim, 
  onViewDetails, 
  showActions = true,
  isClaimable = false 
}: OrderCardProps) => {
  const getOrderTypeEmoji = (type: string) => {
    switch (type) {
      case 'cleaning': return '🧽';
      case 'cooking': return '👩‍🍳';
      case 'laundry': return '👕';
      default: return '🐰';
    }
  };

  const getOrderTypeText = (type: string) => {
    switch (type) {
      case 'cleaning': return '清洁服务';
      case 'cooking': return '做饭服务';
      case 'laundry': return '洗衣服务';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">待接单</Badge>;
      case 'assigned':
        return <Badge variant="default">已接单</Badge>;
      case 'in_progress':
        return <Badge variant="default">进行中</Badge>;
      case 'completed':
        return <Badge variant="outline">已完成</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="p-4 border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getOrderTypeEmoji(order.type)}</div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">
              {getOrderTypeText(order.type)}
            </h3>
            {getStatusBadge(order.status)}
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{order.duration_minutes} 分钟</span>
              {order.distance_minutes && (
                <>
                  <span>·</span>
                  <span>距离 {order.distance_minutes} 分钟</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{order.address}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium text-foreground">¥{order.payout}</span>
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2 pt-2">
              {isClaimable && onClaim && (
                <Button 
                  size="sm" 
                  onClick={() => onClaim(order.id)}
                  className="flex-1"
                >
                  立即接单
                </Button>
              )}
              {onViewDetails && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(order.id)}
                  className={isClaimable ? "flex-1" : "w-full"}
                >
                  查看详情
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};