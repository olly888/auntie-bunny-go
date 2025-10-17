import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, CheckCircle } from "lucide-react";
import { DemoOrder } from "@/hooks/useDemoOrders";
import { useNavigate } from "react-router-dom";

export interface OnboardingTask {
  id: string;
  type: string;
  duration: string;
  address: string;
  distance: string;
  payout: string;
  isOnboardingTask: true;
  completed: boolean;
  route: string;
  description: string;
  benefit?: string;
}

interface OrderCardProps {
  order: DemoOrder | OnboardingTask;
  onClaim?: (orderId: string) => void;
  variant?: 'default' | 'compact';
}

export const OrderCard = ({ order, onClaim, variant = 'default' }: OrderCardProps) => {
  const navigate = useNavigate();
  const isOnboardingTask = 'isOnboardingTask' in order && order.isOnboardingTask;
  
  if (variant === 'compact') {
    return (
      <Card className={`p-4 ${isOnboardingTask ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20' : 'bg-gradient-card'}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-card-foreground">{order.type}</span>
                {isOnboardingTask && order.completed && (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    已完成
                  </Badge>
                )}
                {!isOnboardingTask && (
                  <>
                    <span className="text-sm text-muted-foreground">|</span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{order.duration}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground truncate">
                {isOnboardingTask ? (
                  order.benefit && (
                    <>
                      <span className="text-primary font-medium">✓</span>
                      <span className="text-primary text-xs font-medium">{order.benefit}</span>
                      <span>·</span>
                    </>
                  )
                ) : null}
                <MapPin className="w-3 h-3" />
                <span className="truncate">{order.address}</span>
                {!isOnboardingTask && <span>({order.distance})</span>}
              </div>
              {isOnboardingTask && (
                <p className="text-sm font-medium text-primary/80 mt-1.5">
                  {order.description}
                </p>
              )}
            </div>
            {!isOnboardingTask && (
              <div className="text-right ml-2">
                <div className="text-lg font-bold text-primary">¥{order.payout}</div>
              </div>
            )}
          </div>
          
          {isOnboardingTask ? (
            order.completed ? (
              <Button 
                className="w-full"
                variant="outline"
                disabled
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                已完成
              </Button>
            ) : (
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-primary-foreground font-bold shadow-lg"
              onClick={() => navigate(order.route)}
            >
              立即解锁 🎁
            </Button>
            )
          ) : (
            <Button 
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button"
              onClick={() => onClaim?.(order.id)}
            >
              抢单
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 shadow-card ${isOnboardingTask ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20' : 'bg-gradient-card'}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{order.type.split(' ')[0]}</span>
            <div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-card-foreground">{order.type}</div>
                {isOnboardingTask && order.completed && (
                  <Badge variant="default">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    已完成
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{order.duration}</span>
              </div>
            </div>
          </div>
          {!isOnboardingTask && (
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">¥{order.payout}</div>
              <div className="text-xs text-muted-foreground">预计提成</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{order.address}</span>
          {!isOnboardingTask && <span>({order.distance})</span>}
        </div>

        {isOnboardingTask && (
          <p className="text-sm text-muted-foreground">
            {order.description}
          </p>
        )}

        {isOnboardingTask ? (
          order.completed ? (
            <Button 
              className="w-full"
              variant="outline"
              disabled
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              已完成
            </Button>
          ) : (
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-primary-foreground font-bold shadow-lg"
              onClick={() => navigate(order.route)}
            >
              立即解锁 🎁
            </Button>
          )
        ) : (
          <Button 
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button"
            onClick={() => onClaim?.(order.id)}
          >
            立即抢单
          </Button>
        )}
      </div>
    </Card>
  );
};