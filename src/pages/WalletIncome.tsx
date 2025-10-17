import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, Clock, MapPin, Banknote, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const WalletIncome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  
  // 从数据库获取真实订单数据
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['income-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_filtered_orders');
      
      if (error) throw error;
      
      // 只返回已完成的订单
      return (data || []).filter((order: any) => 
        order.status === 'completed' && order.completed_at
      );
    },
  });

  // 创建测试订单
  const handleCreateDemoOrders = async () => {
    setIsCreatingDemo(true);
    try {
      const { data, error } = await supabase.rpc('create_demo_completed_orders');
      
      if (error) throw error;
      
      toast.success("测试订单创建成功", {
        description: `已创建 ${data?.length || 5} 个已完成订单`
      });
      
      // 刷新订单列表
      refetch();
    } catch (error: any) {
      console.error('Error creating demo orders:', error);
      toast.error("创建失败", {
        description: error.message || "请稍后重试"
      });
    } finally {
      setIsCreatingDemo(false);
    }
  };

  const getOrderTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'cleaning': '清洁服务',
      'maintenance': '维修服务',
      'delivery': '配送服务',
      'other': '其他服务'
    };
    return typeMap[type] || type;
  };

  const getIncomeTypeIcon = (type: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'cleaning': <div className="text-lg">🧽</div>,
      'maintenance': <div className="text-lg">🔧</div>,
      'delivery': <div className="text-lg">📦</div>,
      'other': <Banknote className="w-5 h-5 text-primary" />
    };
    return iconMap[type] || <Banknote className="w-5 h-5 text-primary" />;
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'settled') return order.settled === true;
    if (activeTab === 'pending') return order.settled !== true;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/wallet')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">收入明细</h1>
          </div>
          
          {orders.length === 0 && !isLoading && (
            <Button
              size="sm"
              onClick={handleCreateDemoOrders}
              disabled={isCreatingDemo}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isCreatingDemo ? "创建中..." : "生成测试数据"}
            </Button>
          )}
        </div>

        {/* 收入筛选 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="settled">已结算</TabsTrigger>
            <TabsTrigger value="pending">待结算</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-lg mb-2">暂无收入记录</div>
                  <div className="text-sm">
                    {activeTab === 'all' 
                      ? '还没有完成的订单记录' 
                      : activeTab === 'settled'
                      ? '暂无已结算的订单'
                      : '暂无待结算的订单'}
                  </div>
                </div>
              ) : (
                filteredOrders.map((order: any) => (
                  <div 
                    key={order.id} 
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="bg-card rounded-xl p-4 shadow-card border border-border/50 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getIncomeTypeIcon(order.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-foreground">{getOrderTypeLabel(order.type)}</div>
                            <div className="text-xs text-muted-foreground">
                              服务订单#{order.id.slice(-4)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">¥{order.payout.toFixed(2)}</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              order.settled ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                            }`}>
                              {order.settled ? '已结算' : '待结算'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate max-w-32">{order.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{order.duration_minutes}分钟</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          入账时间：{format(new Date(order.completed_at), 'MM月dd日 HH:mm', { locale: zhCN })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

      </div>
      
      <BottomNav />
    </div>
  );
};

export default WalletIncome;
