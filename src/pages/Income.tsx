import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ChevronRight, CreditCard, TrendingUp, FileText, HelpCircle, AlertCircle } from "lucide-react";
import { TimeFilter } from "@/components/income/TimeFilter";
import { IncomeChart } from "@/components/income/IncomeChart";
import { LoadingSkeleton } from "@/components/income/LoadingSkeleton";
import { useIncomeData, TimePeriod } from "@/hooks/useIncomeData";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Income = () => {
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { stats, chartData, isLoading, error } = useIncomeData(period, selectedDate);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const menuItems = [
    { icon: FileText, title: "收入明细", description: "查看详细收入记录" },
    { icon: TrendingUp, title: "我的业绩", description: "查看服务统计" },
    { icon: CreditCard, title: "我的银行卡", description: "管理提现账户" },
    { icon: HelpCircle, title: "薪资说明", description: "了解薪资计算规则" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">我的收入</h1>
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
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 核心数据看板 */}
        <div className="bg-gradient-primary rounded-2xl p-6 text-center text-primary-foreground shadow-lg">
          <div className="text-sm opacity-90 mb-2">
            {period === 'day' && '当日订单提成 (元)'}
            {period === 'month' && '本月订单提成 (元)'}
            {period === 'year' && '本年订单提成 (元)'}
          </div>
          <div className="text-4xl font-bold mb-4">
            {stats.totalCommission.toFixed(2)}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.completedOrders}</div>
              <div className="text-xs opacity-80">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">¥{stats.baseSalary}</div>
              <div className="text-xs opacity-80">固定底薪</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.serviceHours}h</div>
              <div className="text-xs opacity-80">服务时长</div>
            </div>
          </div>
        </div>

        {/* 收入趋势图 */}
        <IncomeChart data={chartData} period={period} />

        {/* 业绩概览 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {period === 'day' && '今日业绩概览'}
            {period === 'month' && '本月业绩概览'}  
            {period === 'year' && '本年业绩概览'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <DataCard 
              title="服务订单" 
              value={stats.completedOrders} 
              unit="单"
            />
            <DataCard 
              title="平均评分" 
              value={stats.averageRating} 
              unit="分"
            />
            <DataCard 
              title="准时率" 
              value={stats.onTimeRate} 
              unit="%"
            />
            <DataCard 
              title="服务小时" 
              value={stats.serviceHours} 
              unit="小时"
            />
          </div>
        </div>

        {/* 功能入口列表 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">更多功能</h2>
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full h-auto p-4 justify-between bg-card hover:bg-accent/50 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </div>

        {/* 提现按钮 */}
        <div className="pt-4">
          <Button variant="primary" size="lg" className="w-full">
            <CreditCard className="w-5 h-5 mr-2" />
            申请提现
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Income;