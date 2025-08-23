import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, Clock, MapPin, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IncomeDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock static data for demo purposes
  const mockOrders = [
    {
      id: "order_001",
      type: "cleaning",
      payout: 85.50,
      address: "华润城润府",
      duration_minutes: 120,
      completed_at: new Date("2024-01-15T10:30:00"),
      settled: true
    },
    {
      id: "order_002", 
      type: "maintenance",
      payout: 120.00,
      address: "万科云城",
      duration_minutes: 90,
      completed_at: new Date("2024-01-14T14:20:00"),
      settled: true
    },
    {
      id: "order_003",
      type: "delivery", 
      payout: 45.00,
      address: "海岸城",
      duration_minutes: 60,
      completed_at: new Date("2024-01-13T16:45:00"),
      settled: false
    },
    {
      id: "order_004",
      type: "cleaning",
      payout: 95.00,
      address: "深业上城",
      duration_minutes: 150,
      completed_at: new Date("2024-01-12T09:15:00"),
      settled: false
    }
  ];

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
  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'settled') return order.settled;
    if (activeTab === 'pending') return !order.settled;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/income')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">收入明细</h1>
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
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-lg mb-2">暂无收入记录</div>
                  <div className="text-sm">该分类下没有订单记录</div>
                </div>
              ) : (
                filteredOrders.map((order: any) => (
                  <div key={order.id} className="bg-card rounded-xl p-4 shadow-card border border-border/50">
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

export default IncomeDetails;