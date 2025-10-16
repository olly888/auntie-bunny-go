import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wallet, ChevronRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyWallet = () => {
  const navigate = useNavigate();

  // 模拟数据 - 实际项目中从API获取
  const walletData = {
    withdrawableBalance: 128.00,
    pendingAmount: 50.00,
    totalEarnings: 2580.50
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">我的钱包</h1>
          <div className="w-9" />
        </div>

        <div className="p-4 space-y-6">
          {/* 核心数据卡片 */}
          <Card className="bg-gradient-primary text-primary-foreground shadow-card">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* 可提现余额 */}
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-2">可提现余额</div>
                  <div className="text-4xl font-bold mb-1">¥{walletData.withdrawableBalance.toFixed(2)}</div>
                </div>

                {/* 其他数据 */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-foreground/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">¥{walletData.pendingAmount.toFixed(2)}</div>
                    <div className="text-xs opacity-80 mt-1">审核中金额</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">¥{walletData.totalEarnings.toFixed(2)}</div>
                    <div className="text-xs opacity-80 mt-1">累计总收入</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 核心按钮 - 申请提现 */}
          <Button 
            variant="default" 
            size="lg" 
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button"
            onClick={() => navigate('/withdraw')}
          >
            <Wallet className="w-5 h-5 mr-2" />
            申请提现
          </Button>

          {/* 附属入口 */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-foreground">更多服务</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-4 hover:bg-accent"
                onClick={() => navigate("/withdraw/history")}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-foreground">提现记录</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-4 hover:bg-accent"
                onClick={() => navigate("/income/settlement-rules")}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="text-foreground">结算规则说明</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyWallet;
