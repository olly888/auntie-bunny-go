import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Phone, Bell } from "lucide-react";
import rabbitMascot from "@/assets/rabbit-mascot.png";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useCurrentTask } from "@/hooks/orders/useCurrentTask";
import { useTodayStats } from "@/hooks/orders/useTodayStats";
import { useOrdersRealtime } from "@/hooks/orders/useOrdersRealtime";
import { TaskHallList } from "@/components/orders/TaskHallList";
import { OrderBroadcastModal } from "@/components/orders/OrderBroadcastModal";
import { CurrentTaskCard } from "@/components/orders/CurrentTaskCard";
import { CompletedTodayList } from "@/components/orders/CompletedTodayList";

const Workbench = () => {
  const { isOnline, setIsOnline } = useOnlineStatus();
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const navigate = useNavigate();
  
  // Data hooks
  const { data: currentTask } = useCurrentTask();
  const { data: todayStats } = useTodayStats();
  const { newOrder, clearNewOrder } = useOrdersRealtime(isOnline);

  const hasCurrentTask = !!currentTask;
  const isInProgress = currentTask?.status === 'in_progress';
  
  // Mock unread notifications count - will be replaced with real data later
  const unreadNotifications = 3;

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

  const handleNotificationClick = () => {
    navigate("/notifications");
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
        
        {/* 顶部问候与通知 */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold mb-1">早上好，小兔！</h1>
              <p className="text-sm text-primary-foreground/80">
                今天又是充满活力的一天 🌟
              </p>
              {todayStats && (
                <p className="text-xs text-primary-foreground/60 mt-1">
                  今日完成 {todayStats.completed} 单 | 工时 {todayStats.workHours} 小时
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* 通知铃铛 */}
              <Button
                variant="ghost"
                size="sm"
                className="relative bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 p-2"
                onClick={handleNotificationClick}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              
              {/* 紧急求助 - 仅服务中显示 */}
              {isInProgress && (
                <Button
                  variant="secondary"
                  size="sm" 
                  className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
                  onClick={() => window.location.href = "tel:400-123-4567"}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  紧急求助
                </Button>
              )}
            </div>
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

        {/* 任务区域 - Tab 切换 */}
        <Card className="p-4">
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="new">新任务</TabsTrigger>
              <TabsTrigger value="progress">进行中</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
            </TabsList>
            
            <TabsContent value="new" className="mt-4">
              {!hasCurrentTask ? (
                <div className="space-y-4">
                  <TaskHallList />
                  {isOnline && (
                    <Card className="p-6 text-center border-2 border-dashed border-primary/30 bg-primary/5">
                      <img 
                        src={rabbitMascot} 
                        alt="兔到到吉祥物" 
                        className="w-16 h-16 mx-auto mb-3 opacity-80"
                      />
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">等待新订单中...</p>
                        <p className="text-sm text-muted-foreground">
                          保持在线状态，随时准备接单
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>当前有任务进行中，无法接收新任务</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="progress" className="mt-4">
              {hasCurrentTask ? (
                <CurrentTaskCard 
                  task={currentTask!} 
                  onViewDetails={handleViewOrderDetails}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>暂无进行中的任务</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              <CompletedTodayList />
            </TabsContent>
          </Tabs>
        </Card>
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