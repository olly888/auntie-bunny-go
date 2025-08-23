
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { TimeFilter } from "@/components/income/TimeFilter";
import { LoadingSkeleton } from "@/components/income/LoadingSkeleton";
import { IncomeChart } from "@/components/income/IncomeChart";
import { useOrdersByPeriod, TimePeriod } from "@/hooks/useOrdersByPeriod";
import { useIncomeSeries } from "@/hooks/useIncomeSeries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyPerformance = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useOrdersByPeriod(period, selectedDate);
  const { data: seriesData, isLoading: seriesLoading } = useIncomeSeries(period, selectedDate);

  const isLoading = ordersLoading || seriesLoading;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Calculate average arrival time (mock data since we don't have this field)
  const averageArrivalMinutes = ordersData?.stats.totalOrders > 0 ? 
    Math.round(8 + Math.random() * 4) : 0; // Mock: 8-12 minutes

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
          <h1 className="text-2xl font-bold text-foreground">我的业绩</h1>
        </div>

        {/* 时间筛选器 */}
        <TimeFilter
          period={period}
          onPeriodChange={setPeriod}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* 错误提示 */}
        {ordersError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>加载数据时出现错误，请稍后重试</AlertDescription>
          </Alert>
        )}

        {/* 业绩指标卡片 */}
        {ordersData && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-xl p-4 text-center shadow-card">
              <div className="text-2xl font-bold text-foreground">{ordersData.stats.totalOrders}</div>
              <div className="text-sm text-muted-foreground">完成订单</div>
            </div>
            <div className="bg-card rounded-xl p-4 text-center shadow-card">
              <div className="text-2xl font-bold text-foreground">{ordersData.stats.totalServiceHours}h</div>
              <div className="text-sm text-muted-foreground">服务时长</div>
            </div>
            <div className="bg-card rounded-xl p-4 text-center shadow-card">
              <div className="text-2xl font-bold text-foreground">{averageArrivalMinutes}</div>
              <div className="text-sm text-muted-foreground">平均到达分钟</div>
            </div>
          </div>
        )}

        {/* 收入趋势图 */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">收入趋势</h3>
          </div>
          
          {seriesData && seriesData.length > 0 ? (
            <IncomeChart data={seriesData} period={period} />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="mb-2">暂无数据</div>
                <div className="text-sm">该时间段内没有完成的订单</div>
              </div>
            </div>
          )}
        </div>

        {/* 总收入汇总 */}
        {ordersData && (
          <div className="bg-gradient-primary rounded-xl p-6 text-center text-primary-foreground shadow-lg">
            <div className="text-sm opacity-90 mb-2">
              {period === 'day' && '当日总收入'}
              {period === 'month' && '本月总收入'}
              {period === 'year' && '本年总收入'}
            </div>
            <div className="text-3xl font-bold">¥{ordersData.stats.totalCommission.toFixed(2)}</div>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default MyPerformance;
