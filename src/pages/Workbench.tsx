import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Phone, RefreshCw, Plus } from "lucide-react";
import { GrabModal, OrderInfo } from "@/components/order/GrabModal";
import { OrderCard } from "@/components/order/OrderCard";
import { useDemoOrders } from "@/hooks/useDemoOrders";
import { toast } from "@/hooks/use-toast";
import rabbitMascot from "@/assets/rabbit-mascot.png";

const Workbench = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("inprogress");
  const [showGrabModal, setShowGrabModal] = useState(false);
  const [broadcastOrder, setBroadcastOrder] = useState<OrderInfo | null>(null);
  const navigate = useNavigate();
  
  const { 
    pendingOrders, 
    completedOrders, 
    currentOrder, 
    todayStats, 
    createOrder, 
    claimOrder, 
    completeOrder 
  } = useDemoOrders();

  const handleToggleOnline = (checked: boolean) => {
    if (checked) {
      setIsOnline(true);
    } else {
      if (currentOrder) {
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

  // 模拟广播弹窗
  const simulateBroadcast = () => {
    if (!isOnline) {
      toast({
        title: "请先上线",
        description: "需要先上线才能接收订单推送",
        variant: "destructive"
      });
      return;
    }

    const newOrder = createOrder();
    const orderInfo: OrderInfo = {
      id: newOrder.id,
      type: newOrder.type,
      duration: newOrder.duration,
      address: newOrder.address,
      distance: newOrder.distance,
      payout: newOrder.payout
    };
    
    setBroadcastOrder(orderInfo);
    setShowGrabModal(true);
    
    toast({
      title: "新订单推送！",
      description: "10秒倒计时开始，请及时抢单",
    });
  };

  // 处理抢单
  const handleGrabOrder = () => {
    if (broadcastOrder) {
      claimOrder(broadcastOrder.id);
      setShowGrabModal(false);
      setBroadcastOrder(null);
      setActiveTab("inprogress");
      
      toast({
        title: "抢单成功！",
        description: `已成功抢到${broadcastOrder.type}订单`,
      });
    }
  };

  // 处理超时（订单流入任务大厅）
  const handleTimeout = () => {
    setShowGrabModal(false);
    setBroadcastOrder(null);
    setActiveTab("hall");
    
    toast({
      title: "订单已流入任务大厅",
      description: "您可以到任务大厅主动选择订单",
    });
  };

  // 从任务大厅抢单
  const handleClaimFromHall = (orderId: string) => {
    // 验证是否可以抢单
    if (!isOnline) {
      toast({
        title: "请先上线",
        description: "需要先上线才能抢单",
        variant: "destructive"
      });
      return;
    }

    if (currentOrder) {
      toast({
        title: "当前已有任务",
        description: "请先完成当前任务再抢新订单",
        variant: "destructive"
      });
      return;
    }

    const claimedOrder = claimOrder(orderId);
    if (claimedOrder) {
      setActiveTab("inprogress");
      toast({
        title: "抢单成功！",
        description: `已成功抢到${claimedOrder.type}订单`,
      });
    }
  };

  // 刷新当前页面内容
  const handleRefresh = () => {
    toast({
      title: "已刷新",
      description: "内容已更新到最新状态",
    });
  };

  // 完成当前订单
  const handleCompleteOrder = () => {
    if (currentOrder) {
      completeOrder();
      setActiveTab("done");
      toast({
        title: "订单已完成！",
        description: `恭喜您完成${currentOrder.type}订单，获得¥${currentOrder.payout}提成`,
      });
    }
  };

  // 计算工作时长（简化计算）
  const workHours = Math.floor(todayStats.completed * 0.75);

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
                    {currentOrder 
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
            今日：{todayStats.completed} 单 · ¥{todayStats.earnings} · {workHours} 小时
          </div>
        </Card>

        {/* TAB栏 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-2">
            <TabsList className="grid flex-1 grid-cols-3">
              <TabsTrigger value="hall" className="relative">
                任务大厅
                {pendingOrders.length > 0 && (
                  <span className="pointer-events-none absolute -top-1.5 -right-1.5 min-w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] leading-4 text-center px-1 shadow-sm">
                    {pendingOrders.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="inprogress" className="relative">
                进行中
                {currentOrder && (
                  <span className="pointer-events-none absolute -top-1.5 -right-1.5 min-w-4 h-4 rounded-full bg-success text-success-foreground text-[10px] leading-4 text-center px-1 shadow-sm">
                    1
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="done" className="relative">
                已完成
                {completedOrders.length > 0 && (
                  <span className="pointer-events-none absolute -top-1.5 -right-1.5 min-w-4 h-4 rounded-full bg-muted text-foreground/70 text-[10px] leading-4 text-center px-1 shadow-sm">
                    {completedOrders.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleRefresh}
              title="刷新"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <TabsContent value="hall" className="mt-4">
            {pendingOrders.length > 0 ? (
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClaim={handleClaimFromHall}
                    variant="compact"
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
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inprogress" className="mt-4">
            {currentOrder ? (
              <div className="bg-gradient-card border-2 border-success rounded-xl p-6 shadow-card relative">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl">{currentOrder.type.split(' ')[0]}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">
                        {currentOrder.type}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        📍 {currentOrder.address} ({currentOrder.distance})
                      </div>
                      <div className="text-sm font-medium text-success">
                        预计提成：¥{currentOrder.payout}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                      服务中
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate("/order-service")}
                    className="px-6"
                  >
                    查看详情
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="p-8 text-center border-2 border-dashed border-muted-foreground/30">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">暂无进行中的任务</p>
                    <p className="text-sm text-muted-foreground">
                      请到任务大厅接单开始工作
                    </p>
                  </div>
                  {isOnline && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={simulateBroadcast}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      模拟广播弹窗
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="done" className="mt-4">
            {completedOrders.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground mb-3">
                  今日已完成 {todayStats.completed} 单，共获得 ¥{todayStats.earnings} 提成
                </div>
                {completedOrders.slice(0, 5).map((order) => (
                  <Card key={order.id} className="p-4 bg-gradient-card">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-card-foreground mb-1">
                          {order.type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.address} | {order.duration}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.createdAt.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-success">
                        +¥{order.payout}
                      </div>
                    </div>
                  </Card>
                ))}
                {completedOrders.length > 5 && (
                  <div className="text-center text-sm text-muted-foreground">
                    显示最近 5 条记录，共 {completedOrders.length} 条
                  </div>
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
      
      {/* 抢单弹窗 */}
      {broadcastOrder && (
        <GrabModal
          orderInfo={broadcastOrder}
          isVisible={showGrabModal}
          onGrab={handleGrabOrder}
          onTimeout={handleTimeout}
        />
      )}
      
      <BottomNav />
    </div>
  );
};

export default Workbench;