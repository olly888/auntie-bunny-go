
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { OrderCountdown } from './OrderCountdown';

interface Order {
  id: string;
  type: string;
  duration_minutes: number;
  address: string;
  payout: number;
  distance_minutes: number | null;
  status: string;
  created_at: string;
}

interface OrderCardProps {
  order: Order;
  onClaim: (orderId: string) => void;
  isLoading?: boolean;
}

export function OrderCard({ order, onClaim, isLoading = false }: OrderCardProps) {
  return (
    <div className="p-4 bg-background/60 border border-border/30 rounded-lg hover:bg-background/80 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-foreground text-base">{order.type}</h3>
            <OrderCountdown createdAt={order.created_at} variant="taskHall" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">酬劳</p>
              <p className="font-semibold text-primary">¥{order.payout}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">时长</p>
              <p className="font-medium text-foreground">{order.duration_minutes}分钟</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">距离</p>
              <p className="font-medium text-foreground">
                {order.distance_minutes ? `${order.distance_minutes}分钟` : '--'}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-muted-foreground text-xs mb-1">地址</p>
            <p className="text-sm text-foreground">{order.address}</p>
          </div>
        </div>
        
        <div className="ml-4">
          <Button 
            onClick={() => onClaim(order.id)}
            disabled={isLoading}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-button"
          >
            {isLoading ? "抢单中..." : "立即抢单"}
          </Button>
        </div>
      </div>
    </div>
  );
}
