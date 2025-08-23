import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { OrderCard } from "@/components/order/OrderCard";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemoOrders } from "@/hooks/useDemoOrders";
import { toast } from "@/hooks/use-toast";
import rabbitMascot from "@/assets/rabbit-mascot.png";

const TaskHall = () => {
  const navigate = useNavigate();
  const { pendingOrders, claimOrder, createOrder } = useDemoOrders();

  const handleClaimOrder = (orderId: string) => {
    const claimedOrder = claimOrder(orderId);
    if (claimedOrder) {
      toast({
        title: "抢单成功！",
        description: `已成功抢到${claimedOrder.type}订单`,
      });
      navigate("/");
    }
  };

  const handleCreateDemoOrder = () => {
    createOrder();
    toast({
      title: "演示订单已创建",
      description: "新的演示订单已添加到任务大厅",
    });
  };

  const handleRefresh = () => {
    // 刷新动画效果
    toast({
      title: "已刷新",
      description: "任务大厅已更新到最新状态",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        
        {/* 页头 */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">任务大厅</h1>
                <div className="text-sm text-muted-foreground">
                  {pendingOrders.length > 0 ? `${pendingOrders.length} 个待抢订单` : '暂无订单'}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          
          {/* 演示功能区 */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-primary">演示功能</div>
              <div className="text-xs text-muted-foreground mb-3">
                点击按钮创建演示订单，体验抢单流程
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={handleCreateDemoOrder}
              >
                创建演示订单
              </Button>
            </div>
          </Card>

          {/* 订单列表 */}
          {pendingOrders.length > 0 ? (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClaim={handleClaimOrder}
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
                <p className="font-medium text-foreground">暂无可接订单</p>
                <p className="text-sm text-muted-foreground">
                  保持在线状态，新订单会自动推送给您
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  或者点击上方按钮创建演示订单进行体验
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default TaskHall;