import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, Wallet, ChevronRight, TrendingUp, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyWallet = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const withdrawableBalance = 1285.50;
  const pendingAmount = 342.00;
  const totalIncome = 8756.30;
  
  // Calculate current month income (mock)
  const currentMonthIncome = 1627.50;

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-md mx-auto space-y-6">
        
        <div className="p-4 space-y-6">
          {/* 核心数据卡片 */}
          <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-primary/20">
...
          </div>

          {/* 附属入口 - 移到前面 */}
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <Button
            variant="ghost"
            className="w-full justify-between h-auto p-4 hover:bg-accent rounded-none"
            onClick={() => navigate('/wallet/income')}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">我的收入</div>
                <div className="text-sm text-muted-foreground">查看详细收入记录</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <div className="text-lg font-bold text-foreground">¥{currentMonthIncome.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">本月</div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Button>
          
          <div className="h-px bg-border" />
          
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-3 px-4 hover:bg-accent rounded-none"
            onClick={() => navigate('/withdraw/history')}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-base text-foreground">提现记录</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>
          
          <div className="h-px bg-border" />
          
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-3 px-4 hover:bg-accent rounded-none"
            onClick={() => navigate('/income/settlement-rules')}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-base text-foreground">结算规则说明</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
        </div>
      </div>
      
      {/* 固定底部按钮 - 申请提现 */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <Button 
            size="lg" 
            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-primary-foreground shadow-lg"
            onClick={() => navigate('/withdraw')}
          >
            <Wallet className="w-6 h-6 mr-2" />
            申请提现
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default MyWallet;
