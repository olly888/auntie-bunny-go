import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone } from "lucide-react";
import { Order } from "@/hooks/orders/useTaskHallOrders";

interface CurrentTaskCardProps {
  task: Order;
  onViewDetails: () => void;
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

const calculateTimeLeft = (startedAt: string, durationMinutes: number) => {
  const startTime = new Date(startedAt).getTime();
  const now = Date.now();
  const elapsedMinutes = Math.floor((now - startTime) / (1000 * 60));
  const remainingMinutes = Math.max(0, durationMinutes - elapsedMinutes);
  return remainingMinutes;
};

export function CurrentTaskCard({ task, onViewDetails }: CurrentTaskCardProps) {
  const icon = getOrderIcon(task.type);
  const timeLeft = task.started_at 
    ? calculateTimeLeft(task.started_at, task.duration_minutes)
    : task.duration_minutes;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">当前任务</h3>
      
      <Card className="p-4 border-2 border-primary bg-gradient-card shadow-card">
        <div className="flex items-center gap-4">
          <div className="text-2xl">{icon}</div>
          <div className="flex-1">
            <div className="font-semibold text-foreground mb-1">
              {task.type} | 剩余约 {timeLeft} 分钟
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              📍 {task.address}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewDetails}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                查看详情
              </Button>
              
              {/* SOS按钮 - 仅在进行中任务时显示 */}
              {task.status === 'in_progress' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => window.location.href = "tel:400-123-4567"}
                  className="text-xs px-2"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  SOS
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}