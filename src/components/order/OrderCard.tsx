import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, DollarSign, Phone, User } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderCardProps {
  order: Order;
  onClaim?: (orderId: string) => void;
  onStatusUpdate?: (orderId: string, status: string) => void;
  showActions?: boolean;
  variant?: 'pending' | 'assigned' | 'in_progress' | 'completed';
}

export function OrderCard({ 
  order, 
  onClaim, 
  onStatusUpdate, 
  showActions = true,
  variant = 'pending' 
}: OrderCardProps) {
  const getStatusBadge = () => {
    const statusMap = {
      pending: { label: '待抢单', variant: 'secondary' as const },
      assigned: { label: '已分配', variant: 'default' as const },
      in_progress: { label: '服务中', variant: 'default' as const },
      completed: { label: '已完成', variant: 'secondary' as const }
    };
    
    const status = statusMap[order.status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  const getTypeIcon = () => {
    const typeMap: Record<string, string> = {
      cleaning: '🧽',
      cooking: '🍳',
      laundry: '👕',
      babysitting: '👶',
      elder_care: '👴',
      pet_care: '🐕',
      default: '🐰'
    };
    return typeMap[order.type] || typeMap.default;
  };

  const getTypeLabel = () => {
    const typeMap: Record<string, string> = {
      cleaning: '家庭清洁',
      cooking: '做饭服务',
      laundry: '洗衣熨烫',
      babysitting: '婴幼儿照看',
      elder_care: '老人照护',
      pet_care: '宠物照看',
    };
    return typeMap[order.type] || order.type;
  };

  const handleClaim = () => {
    if (onClaim) {
      onClaim(order.id);
    }
  };

  const handleStart = () => {
    if (onStatusUpdate) {
      onStatusUpdate(order.id, 'in_progress');
    }
  };

  const handleComplete = () => {
    if (onStatusUpdate) {
      onStatusUpdate(order.id, 'completed');
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getTypeIcon()}</span>
          <div>
            <h3 className="font-medium text-foreground">{getTypeLabel()}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{order.duration_minutes}分钟</span>
              </div>
              {order.distance_minutes && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{order.distance_minutes}分钟路程</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">{order.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-primary">¥{order.payout}</span>
        </div>

        {/* 联系信息（仅对已分配的订单显示） */}
        {(variant === 'assigned' || variant === 'in_progress') && order.contact_name && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{order.contact_name}</span>
            </div>
            {order.contact_phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{order.contact_phone}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2 pt-2">
          {variant === 'pending' && (
            <Button 
              className="flex-1" 
              onClick={handleClaim}
            >
              立即抢单
            </Button>
          )}
          
          {variant === 'assigned' && (
            <>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleStart}
              >
                开始服务
              </Button>
              {order.contact_phone && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => window.location.href = `tel:${order.contact_phone}`}
                >
                  <Phone className="w-4 h-4" />
                </Button>
              )}
            </>
          )}

          {variant === 'in_progress' && (
            <>
              <Button 
                className="flex-1" 
                onClick={handleComplete}
              >
                完成服务
              </Button>
              {order.contact_phone && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => window.location.href = `tel:${order.contact_phone}`}
                >
                  <Phone className="w-4 h-4" />
                </Button>
              )}
            </>
          )}

          {variant === 'completed' && (
            <div className="w-full text-center text-sm text-muted-foreground py-2">
              服务已完成 · 收入 ¥{order.payout}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}