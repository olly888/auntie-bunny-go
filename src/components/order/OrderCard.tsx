import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign, Phone } from "lucide-react";
import type { Order } from "@/hooks/useOrders";

interface OrderCardProps {
  order: Order;
  onClaim?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: string) => void;
  showClaimButton?: boolean;
  showStatusActions?: boolean;
}

export const OrderCard = ({ 
  order, 
  onClaim, 
  onUpdateStatus,
  showClaimButton = false,
  showStatusActions = false 
}: OrderCardProps) => {
  const getOrderTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'cleaning': '洗碗兔',
      'delivery': '跑腿兔', 
      'maintenance': '维修兔',
      'shopping': '购物兔'
    };
    return typeMap[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      'pending': { label: '待抢单', variant: 'outline' },
      'assigned': { label: '已分配', variant: 'secondary' },
      'in_progress': { label: '进行中', variant: 'default' },
      'completed': { label: '已完成', variant: 'secondary' }
    };
    const config = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClaim = () => {
    if (onClaim) {
      onClaim(order.id);
    }
  };

  const handleStartWork = () => {
    if (onUpdateStatus) {
      onUpdateStatus(order.id, 'in_progress');
    }
  };

  const handleComplete = () => {
    if (onUpdateStatus) {
      onUpdateStatus(order.id, 'completed');
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">
              {getOrderTypeLabel(order.type)}
            </span>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-sm text-muted-foreground">
            订单时间: {formatTime(order.created_at)}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-primary font-semibold">
            <DollarSign className="w-4 h-4" />
            ¥{order.payout}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{order.address}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{order.duration_minutes}分钟</span>
          </div>
          {order.distance_minutes && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{order.distance_minutes}分钟路程</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact info for assigned orders */}
      {(order.status !== 'pending') && order.contact_phone && (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4" />
          <span>{order.contact_name || '客户'}: {order.contact_phone}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        {showClaimButton && order.status === 'pending' && (
          <Button 
            onClick={handleClaim}
            className="flex-1"
            size="sm"
          >
            立即抢单
          </Button>
        )}
        
        {showStatusActions && order.status === 'assigned' && (
          <Button 
            onClick={handleStartWork}
            className="flex-1"
            size="sm"
          >
            开始服务
          </Button>
        )}
        
        {showStatusActions && order.status === 'in_progress' && (
          <Button 
            onClick={handleComplete}
            className="flex-1"
            size="sm"
            variant="outline"
          >
            完成服务
          </Button>
        )}
      </div>
    </Card>
  );
};