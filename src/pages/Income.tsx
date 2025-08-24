
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ChevronRight, CreditCard, TrendingUp, FileText, HelpCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TimeFilter } from "@/components/income/TimeFilter";
import { useIncomeData, TimePeriod } from "@/hooks/useIncomeData";

const Income = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Use real income data with filtering
  const incomeData = useIncomeData(period, selectedDate);
  
  // Use stats directly (already includes fallback data in the hook)
  const stats = incomeData.stats;

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
      path: "/wallet/cards"
    }
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

        {/* 核心数据看板 */}
        <div className="bg-gradient-primary rounded-2xl p-6 text-center text-primary-foreground shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="text-sm opacity-90">
              {period === 'day' && '今日订单提成 (元)'}
              {period === 'month' && '本月订单提成 (元)'}
              {period === 'year' && '今年订单提成 (元)'}
            </div>
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
              <div className="text-2xl font-bold">{stats.averageArrivalMinutes}</div>
              <div className="text-xs opacity-80">平均到达分钟</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.serviceHours}h</div>
              <div className="text-xs opacity-80">服务时长</div>
            </div>
          </div>
        </div>

        {/* 功能入口列表 */}
        <div>
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
            onClick={() => navigate('/withdraw')}
          >
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
