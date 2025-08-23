import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ChevronRight, CreditCard, TrendingUp, FileText, HelpCircle } from "lucide-react";

const Income = () => {
  // 收入数据
  const incomeData = {
    monthlyCommission: 2534.40,
    completedOrders: 125,
    baseSalary: 3500,
    lastMonthTotal: 6534
  };

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

        {/* 核心数据看板 */}
        <div className="bg-gradient-primary rounded-2xl p-6 text-center text-primary-foreground shadow-lg">
          <div className="text-sm opacity-90 mb-2">本月订单提成 (元)</div>
          <div className="text-4xl font-bold mb-4">
            {incomeData.monthlyCommission.toFixed(2)}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{incomeData.completedOrders}</div>
              <div className="text-xs opacity-80">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">¥{incomeData.baseSalary}</div>
              <div className="text-xs opacity-80">固定底薪</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">¥{incomeData.lastMonthTotal}</div>
              <div className="text-xs opacity-80">上月总薪资</div>
            </div>
          </div>
        </div>

        {/* 月度业绩概览 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">本月业绩概览</h2>
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