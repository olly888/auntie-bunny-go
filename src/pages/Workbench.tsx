import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DataCard } from "@/components/ui/data-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import rabbitMascot from "@/assets/rabbit-mascot.png";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useCurrentTask } from "@/hooks/orders/useCurrentTask";
import { useTodayStats } from "@/hooks/orders/useTodayStats";
import { useOrdersRealtime } from "@/hooks/orders/useOrdersRealtime";
import { TaskHallList } from "@/components/orders/TaskHallList";
import { OrderBroadcastModal } from "@/components/orders/OrderBroadcastModal";
import { CurrentTaskCard } from "@/components/orders/CurrentTaskCard";

const Workbench = () => {
  const { isOnline, setIsOnline } = useOnlineStatus();
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const navigate = useNavigate();
  
  // Data hooks
  const { data: currentTask } = useCurrentTask();
  const { data: todayStats } = useTodayStats();
  const { newOrder, clearNewOrder } = useOrdersRealtime(isOnline);

  const hasCurrentTask = !!currentTask;

  const handleToggleOnline = (checked: boolean) => {
    if (checked) {
      setIsOnline(true);
    } else {
      if (hasCurrentTask) {
        setShowOfflineDialog(true);
      } else {
        setIsOnline(false);
      }
    }
  };

  const confirmGoOffline = () => {
    setIsOnline(false);
    setShowOfflineDialog(false);
  };

  const handleViewOrderDetails = () => {
    navigate("/order-service");
  };

  // Default stats if loading
  const stats = todayStats || {
    completed: 0,
    earnings: 0,
    workHours: 0,
    rating: 100
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 顶部问候卡片 */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold mb-1">早上好，小兔！</h1>
              <p className="text-sm text-primary-foreground/80">
                今天又是充满活力的一天 🌟
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
              onClick={() => window.location.href = "tel:400-123-4567"}
            >
              <Phone className="w-4 h-4 mr-1" />
              紧急求助
            </Button>
          </div>
        </Card>

        {/* 上线/下线开关控制 */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="font-medium text-foreground">
                {isOnline ? "上线接单" : "下线休息"}
              </span>
            </div>
            <AlertDialog open={showOfflineDialog} onOpenChange={setShowOfflineDialog}>
              <Switch
                checked={isOnline}
                onCheckedChange={handleToggleOnline}
                className="data-[state=checked]:bg-green-500"
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认下线</AlertDialogTitle>
                  <AlertDialogDescription>
                    {hasCurrentTask 
                      ? "您当前有进行中的任务，下线将自动完成当前任务。确定要下线吗？"
                      : "确定要下线休息吗？下线后将无法接收新订单。"
                    }
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowOfflineDialog(false)}>
                    取消
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={confirmGoOffline}>
                    确认下线
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>

        {/* 今日核心数据 */}
        <div className="grid grid-cols-3 gap-4">
          {hasCurrentTask ? (
            <>
              <DataCard title="已完成" value={stats.completed} unit="单" />
              <DataCard title="预估提成" value={`¥${stats.earnings.toFixed(1)}`} />
              <DataCard title="好评率" value={stats.rating} unit="%" />
            </>
          ) : (
            <>
              <DataCard title="今日完成" value={stats.completed} unit="单" />
              <DataCard title="预估提成" value={`¥${stats.earnings.toFixed(1)}`} />
              <DataCard title="今日工时" value={stats.workHours} unit="小时" />
            </>
          )}
        </div>


        {/* 当前任务或任务大厅区域 */}
        {hasCurrentTask ? (
          <CurrentTaskCard 
            task={currentTask!} 
            onViewDetails={handleViewOrderDetails}
          />
        ) : (
          <div className="space-y-6">
            {/* 任务大厅 */}
            <TaskHallList />
            
            {/* 等待状态提示 */}
            {isOnline && (
              <Card className="p-8 text-center border-2 border-dashed border-primary/30 bg-primary/5">
                <img 
                  src={rabbitMascot} 
                  alt="兔到到吉祥物" 
                  className="w-20 h-20 mx-auto mb-4 opacity-80"
                />
                <div className="space-y-2">
                  <p className="font-medium text-foreground">等待新订单中...</p>
                  <p className="text-sm text-muted-foreground">
                    保持在线状态，随时准备接单
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
      
      <BottomNav />
      
      {/* 新订单广播弹窗 */}
      <OrderBroadcastModal 
        order={newOrder} 
        onClose={clearNewOrder}
      />
    </div>
  );
};

export default Workbench;