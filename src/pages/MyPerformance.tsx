
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, TrendingUp, CheckCircle2, Clock, Star, Users, Target, Gift } from "lucide-react";
import { TimeFilter } from "@/components/income/TimeFilter";
import { LoadingSkeleton } from "@/components/income/LoadingSkeleton";
import { IncomeChart } from "@/components/income/IncomeChart";
import { useOrdersByPeriod, TimePeriod } from "@/hooks/useOrdersByPeriod";
import { useIncomeSeries } from "@/hooks/useIncomeSeries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

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

  // Calculate performance metrics (mock data since we don't have these fields)
  const averageRating = ordersData?.stats.totalOrders > 0 ? 4.6 : 0;
  const onTimeRate = ordersData?.stats.totalOrders > 0 ? 95 : 0;
  const inviteCount = 4; // Mock invited users
  const inviteTarget = 5;
  const averageArrivalMinutes = ordersData?.stats.totalOrders > 0 ? 
    Math.round(8 + Math.random() * 4) : 0;

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

        {/* 业绩达标激励提醒 */}
        {ordersData && inviteCount < inviteTarget && (
          <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">去邀请阿姨，奖励再+¥100</div>
                <div className="text-sm text-muted-foreground">还需邀请{inviteTarget - inviteCount}人达成本月目标</div>
              </div>
              <Button size="sm" className="shadow-button">
                去邀请
              </Button>
            </div>
          </div>
        )}

        {/* 核心业绩指标 */}
        {ordersData && (
          <div className="space-y-4">
            {/* 第一行：订单数、服务时长、好评率 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-4 text-center shadow-card">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-5 h-5 text-success mr-1" />
                  <span className="text-xs text-success font-medium">✅ 达标</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{ordersData.stats.totalOrders}</div>
                <div className="text-sm text-muted-foreground">本月服务单数</div>
              </div>
              
              <div className="bg-card rounded-xl p-4 text-center shadow-card">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 text-primary mr-1" />
                </div>
                <div className="text-2xl font-bold text-foreground">{ordersData.stats.totalServiceHours}h</div>
                <div className="text-sm text-muted-foreground">累计服务时长</div>
              </div>
              
              <div className="bg-card rounded-xl p-4 text-center shadow-card">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-4 h-4 text-warning mr-1 fill-current" />
                  <span className="text-xs text-muted-foreground">高于平均</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{averageRating}</div>
                <div className="text-sm text-muted-foreground">好评率</div>
              </div>
            </div>

            {/* 第二行：准点率、邀请进度 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">准点率</span>
                  <span className="text-lg font-bold text-foreground">{onTimeRate}%</span>
                </div>
                <Progress value={onTimeRate} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">表现优秀 🎯</div>
              </div>
              
              <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">邀请新用户</span>
                  <span className="text-sm font-medium text-foreground">{inviteCount}/{inviteTarget}人</span>
                </div>
                <Progress value={(inviteCount / inviteTarget) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {inviteCount >= inviteTarget ? '已达标 ✅' : `差${inviteTarget - inviteCount}人 📈`}
                </div>
              </div>
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
