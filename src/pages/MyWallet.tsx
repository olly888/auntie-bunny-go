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
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">我的钱包</h1>
        </div>

        {/* 核心数据卡片 */}
        <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-primary/20">
          <div className="space-y-6">
            {/* 可提现余额 */}
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">可提现余额</div>
              <div className="text-4xl font-bold text-foreground mb-1">¥{withdrawableBalance.toFixed(2)}</div>
            </div>

            {/* 其他数据 */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">¥{pendingAmount.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">审核中金额</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">¥{totalIncome.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">累计总收入</div>
              </div>
            </div>
          </div>
        </div>

        {/* 核心按钮 - 申请提现 */}
        <Button 
          variant="default" 
          size="lg" 
          className="w-full h-14 text-lg bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button"
          onClick={() => navigate('/withdraw')}
        >
          <Wallet className="w-6 h-6 mr-2" />
          申请提现
        </Button>

        {/* 附属入口 */}
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
      
      <BottomNav />
    </div>
  );
};

export default MyWallet;
