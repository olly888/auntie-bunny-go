import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Phone, RefreshCw, Plus, ChevronRight } from "lucide-react";
import rabbitMascot from "@/assets/rabbit-mascot.png";
import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "@/components/order/OrderCard";

const Workbench = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("inprogress");
  const navigate = useNavigate();
  
  const { 
    pendingOrders, 
    myInProgressOrders, 
    myCompletedOrders,
    loading,
    fetchOrders,
    claimOrder,
    updateOrderStatus,
    createDemoOrder
  } = useOrders();

  const hasCurrentTask = myInProgressOrders.length > 0;

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

  // 今日统计数据
  const todayStats = {
    completed: myCompletedOrders.length,
    earnings: myCompletedOrders.reduce((sum, order) => sum + Number(order.payout), 0),
    rating: 100
  };

  const currentTask = myInProgressOrders[0] || null;

  const handleClaimOrder = async (orderId: string) => {
    await claimOrder(orderId);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 顶部问候卡片 */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground">
          <div>
            <h1 className="text-lg font-semibold mb-1">早上好，小兔！</h1>
            <p className="text-sm text-primary-foreground/80">
              今天又是充满活力的一天 🌟
            </p>
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
          {/* 内嵌统计信息 */}
          <div className="text-xs text-muted-foreground mt-2">
            今日：{todayStats.completed} 单 · ¥{todayStats.earnings.toFixed(1)} · {Math.floor(todayStats.completed * 1.2)} 小时
          </div>
        </Card>

        {/* TAB栏 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-sm grid-cols-3">
              <TabsTrigger value="hall" className="relative">
                任务大厅
                {pendingOrders.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                    {pendingOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="inprogress" className="relative">
                进行中
                {myInProgressOrders.length > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                    {myInProgressOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="done" className="relative">
                已完成
                {myCompletedOrders.length > 0 && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                    {myCompletedOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={createDemoOrder}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={fetchOrders}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <TabsContent value="hall" className="mt-4">
            <div className="space-y-4">
              {/* 前往任务大厅的快捷入口 */}
              <Card 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate('/task-hall')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏪</div>
                    <div>
                      <p className="font-medium text-foreground">任务大厅</p>
                      <p className="text-sm text-muted-foreground">
                        {pendingOrders.length} 个待抢订单
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>

              {/* 最新的几个订单预览 */}
              {loading ? (
                <Card className="p-4 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-8 bg-muted rounded" />
                  </div>
                </Card>
              ) : pendingOrders.length === 0 ? (
                <Card className="p-8 text-center border-2 border-dashed border-primary/30 bg-primary/5">
                  <img 
                    src={rabbitMascot} 
                    alt="兔到到吉祥物" 
                    className="w-20 h-20 mx-auto mb-4 opacity-80"
                  />
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">暂无待抢订单</p>
                    <p className="text-sm text-muted-foreground">
                      {isOnline ? "保持在线状态，随时准备接单" : "请先上线后等待订单"}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={createDemoOrder}
                    >
                      创建演示订单
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.slice(0, 2).map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onClaim={handleClaimOrder}
                      showClaimButton={true}
                    />
                  ))}
                  {pendingOrders.length > 2 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/task-hall')}
                    >
                      查看全部 {pendingOrders.length} 个订单
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inprogress" className="mt-4">
            {myInProgressOrders.length > 0 ? (
              <div className="space-y-3">
                {myInProgressOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateOrderStatus}
                    showStatusActions={true}
                  />
                ))}
                {/* 紧急求助按钮 */}
                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">🚨</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">遇到问题？</p>
                      <p className="text-xs text-muted-foreground">联系客服获得帮助</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = "tel:400-123-4567"}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      紧急求助
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-8 text-center border-2 border-dashed border-muted-foreground/30">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">暂无进行中的任务</p>
                  <p className="text-sm text-muted-foreground">
                    请到任务大厅接单开始工作
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => setActiveTab('hall')}
                  >
                    前往任务大厅
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="done" className="mt-4">
            {myCompletedOrders.length > 0 ? (
              <div className="space-y-3">
                {/* 今日收益汇总 */}
                <Card className="p-4 bg-gradient-primary text-primary-foreground">
                  <div className="text-center space-y-1">
                    <p className="text-sm opacity-90">今日收益</p>
                    <p className="text-2xl font-bold">¥{todayStats.earnings.toFixed(1)}</p>
                    <p className="text-xs opacity-80">共完成 {todayStats.completed} 单</p>
                  </div>
                </Card>
                
                {/* 完成的订单列表 */}
                {myCompletedOrders.slice(0, 5).map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                  />
                ))}
                
                {myCompletedOrders.length > 5 && (
                  <Button variant="outline" className="w-full">
                    查看更多历史订单
                  </Button>
                )}
              </div>
            ) : (
              <Card className="p-8 text-center border-2 border-dashed border-muted-foreground/30">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">暂无已完成订单</p>
                  <p className="text-sm text-muted-foreground">
                    完成任务后将在这里显示历史记录
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Workbench;