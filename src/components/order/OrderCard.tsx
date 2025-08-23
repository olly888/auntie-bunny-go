import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";
import { DemoOrder } from "@/hooks/useDemoOrders";

interface OrderCardProps {
  order: DemoOrder;
  onClaim: (orderId: string) => void;
  variant?: 'default' | 'compact';
}

export const OrderCard = ({ order, onClaim, variant = 'default' }: OrderCardProps) => {
  if (variant === 'compact') {
    return (
      <Card className="p-4 bg-gradient-card">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-card-foreground">{order.type}</span>
              <span className="text-sm text-muted-foreground">|</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{order.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{order.address}</span>
              <span>({order.distance})</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary mb-1">¥{order.payout}</div>
            <Button 
              size="sm" 
              variant="default"
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              onClick={() => onClaim(order.id)}
            >
              抢单
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{order.type.split(' ')[0]}</span>
            <div>
              <div className="font-semibold text-card-foreground">{order.type}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{order.duration}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">¥{order.payout}</div>
            <div className="text-xs text-muted-foreground">预计提成</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{order.address}</span>
          <span>({order.distance})</span>
        </div>

        <Button 
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button"
          onClick={() => onClaim(order.id)}
        >
          立即抢单
        </Button>
      </div>
    </Card>
  );
};