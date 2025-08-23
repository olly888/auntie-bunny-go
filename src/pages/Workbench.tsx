import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Phone, RefreshCw, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "@/components/order/OrderCard";
import rabbitMascot from "@/assets/rabbit-mascot.png";

const Workbench = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("hall");
  const navigate = useNavigate();
  
  const { 
    hallOrders, 
    inProgressOrders, 
    completedOrders, 
    loading, 
    currentUserId,
    fetchOrders,
    createDemoOrder,
    claimOrder
  } = useOrders();

  const hasCurrentTask = inProgressOrders.length > 0;

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

  // 计算今日统计
  const todayStats = {
    completed: completedOrders.length,
    earnings: completedOrders.reduce((sum, order) => sum + Number(order.payout), 0),
    rating: 100
  };

  const currentTask = inProgressOrders.length > 0 ? inProgressOrders[0] : null;

  const handleClaimOrder = async (orderId: string) => {
    await claimOrder(orderId);
  };

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/order-service?id=${orderId}`);
  };

  const handleCreateDemoOrder = async () => {
    await createDemoOrder();
    setActiveTab("hall");
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
                {hallOrders.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {hallOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="inprogress" className="relative">
                进行中
                {inProgressOrders.length > 0 && (
                  <Badge variant="default" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {inProgressOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="done">已完成</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={fetchOrders}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCreateDemoOrder}
              >
                <Plus className="w-4 h-4 mr-1" />
                演示订单
              </Button>
            </div>
          </div>

          <TabsContent value="hall" className="mt-4">
            {loading ? (
              <Card className="p-8 text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">加载中...</p>
              </Card>
            ) : hallOrders.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">可接订单 ({hallOrders.length})</h3>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? "点击接单开始工作" : "请先上线后接单"}
                  </p>
                </div>
                {hallOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClaim={isOnline ? handleClaimOrder : undefined}
                    onViewDetails={handleViewOrderDetails}
                    isClaimable={isOnline && !currentTask}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-2 border-dashed border-primary/30 bg-primary/5">
                <img 
                  src={rabbitMascot} 
                  alt="兔到到吉祥物" 
                  className="w-20 h-20 mx-auto mb-4 opacity-80"
                />
                <div className="space-y-2">
                  <p className="font-medium text-foreground">等待新订单中...</p>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? "保持在线状态，随时准备接单" : "请先上线后等待订单"}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={handleCreateDemoOrder}
                >
                  创建演示订单
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inprogress" className="mt-4">
            {inProgressOrders.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">进行中任务 ({inProgressOrders.length})</h3>
                </div>
                {inProgressOrders.map((order) => (
                  <div key={order.id} className="bg-gradient-card border-2 border-primary rounded-xl p-6 shadow-card">
                    <OrderCard
                      order={order}
                      onViewDetails={handleViewOrderDetails}
                      showActions={false}
                    />
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewOrderDetails(order.id)}
                        className="flex-1"
                      >
                        查看详情
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = "tel:400-123-4567"}
                        className="flex-1"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        紧急求助
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-2 border-dashed border-muted-foreground/30">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">暂无进行中的任务</p>
                  <p className="text-sm text-muted-foreground">
                    请到任务大厅接单开始工作
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="done" className="mt-4">
            {completedOrders.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">已完成任务 ({completedOrders.length})</h3>
                  <p className="text-sm text-muted-foreground">
                    总收入：¥{completedOrders.reduce((sum, order) => sum + Number(order.payout), 0).toFixed(1)}
                  </p>
                </div>
                {completedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewOrderDetails}
                    showActions={false}
                  />
                ))}
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