import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { DataCard } from "@/components/ui/data-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Bell, Phone, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useCurrentTask } from "@/hooks/orders/useCurrentTask";
import { useTodayStats } from "@/hooks/orders/useTodayStats";
import { useOrdersRealtime } from "@/hooks/orders/useOrdersRealtime";
import { useTaskHallOrders } from "@/hooks/orders/useTaskHallOrders";
import { CurrentTaskCard } from "@/components/orders/CurrentTaskCard";
import { TaskHallList } from "@/components/orders/TaskHallList";
import { CompletedTodayList } from "@/components/orders/CompletedTodayList";
import { OrderBroadcastModal } from "@/components/orders/OrderBroadcastModal";

const Workbench = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isOnline, setIsOnline } = useOnlineStatus();
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  
  // 获取实时数据
  const { data: currentTask } = useCurrentTask();
  const { data: todayStats } = useTodayStats();
  const { data: taskHallOrders } = useTaskHallOrders();
  const { newOrder, dismissOrder } = useOrdersRealtime();

  // Mock 通知数据
  const notifications = {
    unread: 2
  };

  const handleToggleOnline = () => {
    if (!isOnline) {
      setIsOnline(true);
    } else {
      if (currentTask) {
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
  const defaultStats = {
    completed: 0,
    earnings: 0,
    workHours: 0,
    rating: 100
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 顶部状态栏 - 避开微信胶囊区域 */}
        <div className="pt-safe-top">
          <div className="flex items-center justify-between pr-safe-right">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={handleToggleOnline}
            >
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isOnline ? "在线接单中" : "离线状态"}
                </p>
                <p className="text-xs text-muted-foreground">
                  轻触切换状态
                </p>
              </div>
            </div>
          </div>
          
          {/* 通知和SOS按钮区域 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('zh-CN')} · 
              {currentTask ? "工作中" : isOnline ? "等待订单" : "休息中"}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleNotificationClick()}
                className="relative p-2"
              >
                <Bell className="w-5 h-5" />
                {notifications.unread > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {notifications.unread}
                  </Badge>
                )}
              </Button>

              {currentTask && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="bg-destructive/90 hover:bg-destructive text-destructive-foreground"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  SOS
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 今日数据统计 */}
        <div className="grid grid-cols-4 gap-3">
          <DataCard 
            title="已完成" 
            value={todayStats?.completed || 0} 
            unit="单"
          />
          <DataCard 
            title="收入" 
            value={`${todayStats?.earnings || 0}`} 
            unit="元"
          />
          <DataCard 
            title="工时" 
            value={`${todayStats?.workHours || 0}`} 
            unit="小时"
          />
          <DataCard 
            title="评分" 
            value={`${todayStats?.rating || 100}`} 
            unit="分"
          />
        </div>

        {/* 核心工作区域 */}
        <div className="space-y-4">
          {/* 当前任务卡片 */}
          {currentTask && (
            <CurrentTaskCard 
              task={currentTask}
              onViewDetails={handleViewOrderDetails}
            />
          )}
          
          {/* 任务大厅/进行中/已完成切换 */}
          <Tabs value="task-hall" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="task-hall">
                任务大厅
                {taskHallOrders && taskHallOrders.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {taskHallOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="in-progress">进行中</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
            </TabsList>
            
            <TabsContent value="task-hall" className="mt-4 space-y-4">
              {/* 数据更新状态 */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  最后更新: {new Date().toLocaleTimeString('zh-CN')}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    console.log('Manual refresh triggered');
                    queryClient.invalidateQueries({ queryKey: ['task-hall-orders'] });
                  }}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  刷新
                </Button>
              </div>
              
              <TaskHallList />
            </TabsContent>
            
            <TabsContent value="in-progress" className="mt-4">
              {currentTask ? (
                <div className="p-4 text-center text-muted-foreground">
                  当前任务已在上方显示
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  暂无进行中的任务
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              <CompletedTodayList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <BottomNav />
      
      {/* 新订单广播弹窗 */}
      <OrderBroadcastModal 
        order={newOrder} 
        onClose={dismissOrder}
      />
      
      {/* 下线确认对话框 */}
      <AlertDialog open={showOfflineDialog} onOpenChange={setShowOfflineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认下线</AlertDialogTitle>
            <AlertDialogDescription>
              {currentTask 
                ? "您当前有进行中的任务，下线后将无法完成任务。确定要下线吗？"
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
  );
};

export default Workbench;