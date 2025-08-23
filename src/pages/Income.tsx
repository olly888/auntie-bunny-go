import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronRight, CreditCard, TrendingUp, FileText, HelpCircle, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTodayStats } from "@/hooks/orders/useTodayStats";

const Income = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<"day" | "month" | "year">("month");
  
  // Get today's stats from the hook
  const { data: todayStats } = useTodayStats();
  
  // Mock employment type - will be replaced with real data later
  const [employmentType, setEmploymentType] = useState<'employee' | 'contractor'>('contractor');
  
  // Calculate income data based on time range (mock for now)
  const incomeData = {
    monthlyCommission: todayStats?.earnings || 0,
    completedOrders: todayStats?.completed || 0,
    baseSalary: employmentType === 'employee' ? 3500 : 0,
    lastMonthTotal: 6534,
    workHours: todayStats?.workHours || 0
  };

  const menuItems = [
    { 
      icon: FileText, 
      title: "收入明细", 
      description: "查看详细收入记录",
      path: "/income/details"
    },
    { 
      icon: TrendingUp, 
      title: "我的业绩", 
      description: "查看服务统计",
      path: "/income/performance"
    },
    { 
      icon: CreditCard, 
      title: "我的银行卡", 
      description: "管理提现账户",
      path: "/income/bank-cards"
    },
    { 
      icon: HelpCircle, 
      title: "薪资说明", 
      description: "了解薪资计算规则",
      path: "/income/salary-info"
    }
  ];

  const handleWithdrawal = () => {
    if (employmentType === 'employee') {
      // Show employee reminder
      alert('员工制用户每月15日前发放薪资到绑定的银行卡中，无需申请提现。');
      return;
    }
    // Navigate to withdrawal process for contractors
    navigate('/income/withdrawal');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-bold text-foreground">我的收入</h1>
        </div>
        
        {/* 时间筛选 */}
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 时间范围切换 */}
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as "day" | "month" | "year")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day">按日</TabsTrigger>
            <TabsTrigger value="month">按月</TabsTrigger>
            <TabsTrigger value="year">按年</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 核心数据看板 */}
        <div className="bg-gradient-primary rounded-2xl p-6 text-center text-primary-foreground shadow-lg">
          <div className="text-sm opacity-90 mb-2">
            {timeRange === 'day' ? '今日' : timeRange === 'month' ? '本月' : '本年'}订单提成 (元)
          </div>
          <div className="text-4xl font-bold mb-4">
            {incomeData.monthlyCommission.toFixed(2)}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{incomeData.completedOrders}</div>
              <div className="text-xs opacity-80">已完成订单</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{incomeData.workHours}</div>
              <div className="text-xs opacity-80">工作时长(小时)</div>
            </div>
            {employmentType === 'employee' && (
              <div className="text-center">
                <div className="text-2xl font-bold">¥{incomeData.baseSalary}</div>
                <div className="text-xs opacity-80">固定底薪</div>
              </div>
            )}
            {employmentType === 'contractor' && (
              <div className="text-center">
                <div className="text-2xl font-bold">100</div>
                <div className="text-xs opacity-80">评分(%)</div>
              </div>
            )}
          </div>
        </div>

        {/* 业绩概览 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {timeRange === 'day' ? '今日' : timeRange === 'month' ? '本月' : '本年'}业绩概览
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <DataCard 
              title="服务订单" 
              value={incomeData.completedOrders} 
              unit="单"
            />
            <DataCard 
              title="平均评分" 
              value="4.9" 
              unit="分"
            />
            <DataCard 
              title="准时率" 
              value="98" 
              unit="%"
            />
            <DataCard 
              title="完成率" 
              value="100" 
              unit="%"
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
                onClick={() => navigate(item.path)}
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
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full"
            onClick={handleWithdrawal}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {employmentType === 'employee' ? '查看薪资发放' : '申请提现'}
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Income;