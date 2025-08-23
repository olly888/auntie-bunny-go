import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Plus, ArrowLeft } from 'lucide-react';
import { OrderCard } from '@/components/order/OrderCard';
import { useOrders } from '@/hooks/useOrders';
import { useNavigate } from 'react-router-dom';
import rabbitMascot from '@/assets/rabbit-mascot.png';

export default function TaskHall() {
  const navigate = useNavigate();
  const { 
    pendingOrders, 
    loading, 
    claimOrder, 
    createDemoOrder, 
    refetch 
  } = useOrders();

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateDemo = () => {
    createDemoOrder();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-background border-b border-border p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">任务大厅</h1>
                <p className="text-sm text-muted-foreground">
                  {pendingOrders.length} 个待抢订单
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCreateDemo}
                disabled={loading}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-4 pb-20 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-4 h-32 animate-pulse bg-muted/50" />
              ))}
            </div>
          ) : pendingOrders.length > 0 ? (
            <div className="space-y-4">
              {pendingOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClaim={claimOrder}
                  variant="pending"
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
              <div className="space-y-2 mb-4">
                <p className="font-medium text-foreground">暂无可抢订单</p>
                <p className="text-sm text-muted-foreground">
                  等待新订单发布，或创建演示订单进行体验
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleCreateDemo}
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                创建演示订单
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}