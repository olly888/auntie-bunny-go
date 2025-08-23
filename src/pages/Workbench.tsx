import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Phone, Bell, RefreshCw } from "lucide-react";
import rabbitMascot from "@/assets/rabbit-mascot.png";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useCurrentTask } from "@/hooks/orders/useCurrentTask";
import { useTodayStats } from "@/hooks/orders/useTodayStats";
import { useOrdersRealtime } from "@/hooks/orders/useOrdersRealtime";
import { useTaskHallOrders } from "@/hooks/orders/useTaskHallOrders";
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
  const { data: taskHallOrders, refetch: refetchTaskHall } = useTaskHallOrders();
  const { newOrder, dismissOrder } = useOrdersRealtime();

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
      <div className="max-w-md mx-auto">
        
        {/* 顶部状态栏 - 最重要信息 */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="p-4">
            <div className="flex items-center justify-between">
              {/* 左侧：上线状态 + 问候 */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${isOnline ? 'text-success' : 'text-muted-foreground'}`}>
                    {isOnline ? "上线中" : "已下线"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  早上好，小兔！
                </div>
              </div>
              
              {/* 右侧：操作按钮 */}
              <div className="flex items-center gap-2">
                {/* 上线/下线开关 */}
                <AlertDialog open={showOfflineDialog} onOpenChange={setShowOfflineDialog}>
                  <Switch
                    checked={isOnline}
                    onCheckedChange={handleToggleOnline}
                    className="data-[state=checked]:bg-success"
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

                {/* 通知铃铛 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2"
                  onClick={handleNotificationClick}
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-2xs flex items-center justify-center"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
                
                {/* 紧急求助 - 仅服务中显示 */}
                {isInProgress && (
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
            
            {/* 今日简要统计 - 次要信息 */}
            {todayStats && (
              <div className="mt-2 text-xs text-muted-foreground">
                今日: {todayStats.completed}单 · ¥{todayStats.earnings.toFixed(0)} · {todayStats.workHours}h
              </div>
            )}
          </div>
        </div>

        {/* 核心工作区域 */}
        <div className="p-4 space-y-4">
          
          {/* 当前任务状态卡片 - 最高优先级 */}
          {hasCurrentTask && (
            <Card className="border-l-4 border-l-primary shadow-lg">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="bg-primary">
                    进行中
                  </Badge>
                  <span className="text-sm font-medium text-foreground">当前任务</span>
                </div>
                <CurrentTaskCard 
                  task={currentTask!} 
                  onViewDetails={handleViewOrderDetails}
                />
              </div>
            </Card>
          )}

          {/* 任务大厅与管理区 */}
          <Card className="overflow-hidden">
            <Tabs defaultValue={hasCurrentTask ? "progress" : "new"} className="w-full">
              <div className="border-b border-border">
                <div className="flex items-center justify-between">
                  <TabsList className="h-12 bg-transparent justify-start rounded-none border-0">
                    <TabsTrigger value="new" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none flex items-center gap-2">
                      任务大厅
                      {taskHallOrders && taskHallOrders.length > 0 && (
                        <Badge variant="destructive" className="h-4 w-4 p-0 text-2xs flex items-center justify-center">
                          {taskHallOrders.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="progress" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                      进行中
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                      已完成
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => refetchTaskHall()}
                    className="mr-4 p-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <TabsContent value="new" className="mt-0">
                  {!hasCurrentTask ? (
                    <div className="space-y-4">
                      <TaskHallList />
                      {isOnline && (
                        <div className="p-6 text-center border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg">
                          <img 
                            src={rabbitMascot} 
                            alt="兔到到吉祥物" 
                            className="w-12 h-12 mx-auto mb-2 opacity-80"
                          />
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">等待新订单中...</p>
                            <p className="text-xs text-muted-foreground">
                              保持在线状态，随时准备接单
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {!isOnline && (
                        <div className="p-6 text-center text-muted-foreground">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-2xl">😴</span>
                          </div>
                          <p className="text-sm font-medium">当前处于下线状态</p>
                          <p className="text-xs mt-1">开启上线开关开始接单</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">当前有任务进行中，无法接收新任务</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="progress" className="mt-0">
                  {hasCurrentTask ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">当前任务详情已在上方显示</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">暂无进行中的任务</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="mt-0">
                  <CompletedTodayList />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
      
      <BottomNav />
      
      {/* 新订单广播弹窗 */}
      <OrderBroadcastModal 
        order={newOrder} 
        onClose={dismissOrder}
      />
    </div>
  );
};

export default Workbench;