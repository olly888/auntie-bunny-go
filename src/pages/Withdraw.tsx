import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Wallet, ChevronRight, AlertCircle, CheckCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Withdraw = () => {
  const navigate = useNavigate();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 模拟数据 - 实际项目中从API获取
  const userInfo = {
    availableAmount: 128.00,
    isDirectEmployee: false, // false表示非直营员工
    isRealNameVerified: true,
    hasLinkedWallet: true,
    walletType: "微信钱包",
    todayWithdrawCount: 0 // 今日已提现次数
  };

  const withdrawalRules = {
    minAmount: 10,
    maxWeeklyCount: 1,
    auditDays: "1个工作日",
    paymentDays: "2个工作日",
    fee: 0
  };

  const handleAmountChange = (value: string) => {
    // 只允许输入数字和小数点
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) || value === "") {
      setWithdrawAmount(value);
    }
  };

  const isValidAmount = () => {
    const amount = parseFloat(withdrawAmount);
    return amount >= withdrawalRules.minAmount && amount <= userInfo.availableAmount;
  };

  const canWithdraw = () => {
    return userInfo.isRealNameVerified && 
           userInfo.hasLinkedWallet && 
           !userInfo.isDirectEmployee &&
           userInfo.todayWithdrawCount < withdrawalRules.maxWeeklyCount &&
           isValidAmount();
  };

  const handleSubmitWithdraw = async () => {
    if (!canWithdraw()) return;

    setIsSubmitting(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 保存到本地存储（实际项目中应该调用API）
      const withdrawRecord = {
        id: Date.now().toString(),
        amount: parseFloat(withdrawAmount),
        status: "审核中",
        submitTime: new Date().toISOString(),
        expectedArrival: "1个工作日审核，预计2个工作日到账",
        method: userInfo.walletType
      };
      
      const existingRecords = JSON.parse(localStorage.getItem("withdrawHistory") || "[]");
      existingRecords.unshift(withdrawRecord);
      localStorage.setItem("withdrawHistory", JSON.stringify(existingRecords));
      
      toast({
        title: "提现申请已提交",
        description: `¥${withdrawAmount} 将在1个工作日内审核，预计2个工作日到账`,
      });
      
      navigate("/withdraw/history");
    } catch (error) {
      toast({
        title: "提现申请失败",
        description: "请稍后重试或联系客服",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-lg font-semibold text-foreground">申请提现</h1>
          <div className="w-9" /> {/* 占位符保持标题居中 */}
        </div>

        <div className="p-4 space-y-6">
          {/* 当前可提现金额 */}
          <Card className="bg-gradient-primary text-primary-foreground shadow-card">
            <CardContent className="p-6 text-center">
              <div className="text-sm opacity-90 mb-2">当前可提现金额</div>
              <div className="text-3xl font-bold mb-2">¥{userInfo.availableAmount.toFixed(2)}</div>
              {!userInfo.isDirectEmployee ? (
                <div className="text-xs opacity-80">仅限非直营人员提现</div>
              ) : (
                <div className="text-xs opacity-80 text-warning-foreground">直营员工不适用提现功能</div>
              )}
            </CardContent>
          </Card>

          {/* 提现表单 */}
          <Card className="shadow-card">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground">提现金额</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="text"
                    placeholder="请输入提现金额"
                    value={withdrawAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    disabled={userInfo.isDirectEmployee}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    元
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  最低提现金额为 ¥{withdrawalRules.minAmount}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">到账方式</Label>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-success" />
                    <div>
                      <div className="font-medium text-foreground">
                        {userInfo.hasLinkedWallet ? userInfo.walletType : "未绑定银行卡"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {userInfo.hasLinkedWallet ? "已绑定" : "提现需绑定银行卡"}
                      </div>
                    </div>
                  </div>
                  {userInfo.hasLinkedWallet ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate('/wallet/cards')}
                    >
                      去绑定
                    </Button>
                  )}
                </div>
                
                {/* 绑定银行卡按钮 */}
                {!userInfo.hasLinkedWallet && (
                  <Button 
                    variant="default" 
                    className="w-full mt-2"
                    onClick={() => navigate('/wallet/cards')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    绑定银行卡
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 提现规则 */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-foreground">提现规则</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">最低提现金额</span>
                <span className="text-foreground">¥{withdrawalRules.minAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">提现频率限制</span>
                <span className="text-foreground">每周限{withdrawalRules.maxWeeklyCount}次</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">审核时间</span>
                <span className="text-foreground">{withdrawalRules.auditDays}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">到账时间</span>
                <span className="text-foreground">审核通过后{withdrawalRules.paymentDays}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">提现手续费</span>
                <span className="text-foreground">{withdrawalRules.fee === 0 ? "暂无" : `¥${withdrawalRules.fee}`}</span>
              </div>
            </CardContent>
          </Card>

          {/* 警告信息 */}
          {userInfo.isDirectEmployee && (
            <Alert className="border-warning bg-warning/10">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                直营员工薪资由平台统一发放，不适用提现功能
              </AlertDescription>
            </Alert>
          )}

          {!userInfo.isRealNameVerified && (
            <Alert className="border-warning bg-warning/10">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                请先完成实名认证后再申请提现
              </AlertDescription>
            </Alert>
          )}

          {!userInfo.hasLinkedWallet && (
            <Alert className="border-warning bg-warning/10">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                请先绑定提现账户后再申请提现
              </AlertDescription>
            </Alert>
          )}

          {/* 提交按钮 */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmitWithdraw}
            disabled={!canWithdraw() || isSubmitting}
          >
            {isSubmitting ? "提交中..." : "提交提现申请"}
          </Button>

          {/* 提现记录入口 */}
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => navigate("/withdraw/history")}
          >
            <span className="text-foreground">提现记录</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;