import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, Clock, MapPin, Filter, Banknote, Gift, Users, Sparkles } from "lucide-react";
import { TimeFilter } from "@/components/income/TimeFilter";
import { LoadingSkeleton } from "@/components/income/LoadingSkeleton";
import { useOrdersByPeriod, TimePeriod } from "@/hooks/useOrdersByPeriod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IncomeDetails = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('all');
  
  const { data, isLoading, error } = useOrdersByPeriod(period, selectedDate);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

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

  // Calculate settled vs pending income (mock data for demo)
  const settledIncome = data?.stats.totalCommission ? data.stats.totalCommission * 0.85 : 0;
  const pendingIncome = data?.stats.totalCommission ? data.stats.totalCommission * 0.15 : 0;

  // Filter orders based on active tab
  const filteredOrders = data?.orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'settled') return Math.random() > 0.15; // Mock: 85% settled
    if (activeTab === 'pending') return Math.random() <= 0.15; // Mock: 15% pending
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

        {/* 时间筛选器 */}
        <TimeFilter
          period={period}
          onPeriodChange={setPeriod}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>加载数据时出现错误，请稍后重试</AlertDescription>
          </Alert>
        )}

        {/* 收入总览 */}
        {data && (
          <div className="bg-gradient-primary rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-4 opacity-90">收入总览</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">¥{settledIncome.toFixed(2)}</div>
                <div className="text-sm opacity-80">本月已结算</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">¥{pendingIncome.toFixed(2)}</div>
                <div className="text-sm opacity-80">本月待结算</div>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-white/20 hover:bg-white/30 border-0 text-white"
              disabled={settledIncome < 50}
            >
              {settledIncome >= 50 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  申请提现
                </>
              ) : (
                `最低提现¥50 (差¥${(50 - settledIncome).toFixed(2)})`
              )}
            </Button>
          </div>
        )}

        {/* 收入筛选 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="settled">已结算</TabsTrigger>
            <TabsTrigger value="pending">待结算</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 收入明细列表 */}
        <div className="space-y-3">
          {filteredOrders?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-lg mb-2">暂无收入记录</div>
              <div className="text-sm">该时间段内没有完成的订单</div>
            </div>
          ) : (
            filteredOrders?.map((order: any) => {
              const isSettled = Math.random() > 0.15; // Mock settled status
              return (
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
                            isSettled ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                          }`}>
                            {isSettled ? '已结算' : '待结算'}
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
              );
            })
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default IncomeDetails;