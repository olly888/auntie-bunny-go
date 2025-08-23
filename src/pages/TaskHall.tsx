import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { RefreshCw, ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "@/components/order/OrderCard";
import rabbitMascot from "@/assets/rabbit-mascot.png";

const TaskHall = () => {
  const navigate = useNavigate();
  const { 
    pendingOrders, 
    loading, 
    fetchOrders, 
    claimOrder, 
    createDemoOrder 
  } = useOrders();

  const handleClaimOrder = async (orderId: string) => {
    const success = await claimOrder(orderId);
    if (success) {
      // Navigate back to workbench to see the claimed order
      navigate('/workbench');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/workbench')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-semibold text-foreground">任务大厅</h1>
                <p className="text-sm text-muted-foreground">
                  {pendingOrders.length} 个待抢订单
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
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
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted rounded w-20" />
                      <div className="h-4 bg-muted rounded w-16" />
                    </div>
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-8 bg-muted rounded w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : pendingOrders.length === 0 ? (
            <Card className="p-8 text-center border-2 border-dashed border-primary/30 bg-primary/5">
              <img 
                src={rabbitMascot} 
                alt="兔到到吉祥物" 
                className="w-20 h-20 mx-auto mb-4 opacity-80"
              />
              <div className="space-y-3">
                <p className="font-medium text-foreground">暂无待抢订单</p>
                <p className="text-sm text-muted-foreground">
                  所有订单都已被抢完，请稍后再来看看
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={createDemoOrder}
                >
                  创建演示订单
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClaim={handleClaimOrder}
                  showClaimButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default TaskHall;