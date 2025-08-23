
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { TimeFilter } from "@/components/income/TimeFilter";
import { LoadingSkeleton } from "@/components/income/LoadingSkeleton";
import { useOrdersByPeriod, TimePeriod } from "@/hooks/useOrdersByPeriod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

const IncomeDetails = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
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

        {/* 汇总数据 */}
        {data && (
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">¥{data.stats.totalCommission.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">总收入</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{data.stats.totalOrders}</div>
                <div className="text-sm text-muted-foreground">订单数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{data.stats.totalServiceHours}h</div>
                <div className="text-sm text-muted-foreground">服务时长</div>
              </div>
            </div>
          </div>
        )}

        {/* 订单明细列表 */}
        <div className="space-y-3">
          {data?.orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-lg mb-2">暂无收入记录</div>
              <div className="text-sm">该时间段内没有完成的订单</div>
            </div>
          ) : (
            data?.orders.map((order: any) => (
              <div key={order.id} className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-foreground">{getOrderTypeLabel(order.type)}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(order.completed_at), 'MM月dd日 HH:mm', { locale: zhCN })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">¥{order.payout.toFixed(2)}</div>
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
              </div>
            ))
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default IncomeDetails;
