
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
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm border-l-4 border-l-primary">
      <div className="space-y-3">
        {/* Order Type & Countdown */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-card-foreground">{order.type}</h3>
          <OrderCountdown createdAt={order.created_at} variant="taskHall" />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-success mr-2" />
            <span className="font-semibold text-success">¥{order.payout}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-primary mr-2" />
            <span className="text-card-foreground">{order.duration_minutes}分钟</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start">
          <MapPin className="w-4 h-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-card-foreground">{order.address}</p>
            {order.distance_minutes && (
              <p className="text-xs text-muted-foreground mt-1">
                预计{order.distance_minutes}分钟路程
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => onClaim(order.id)}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '抢单中...' : '抢单'}
        </Button>
      </div>
    </div>
  );
}
