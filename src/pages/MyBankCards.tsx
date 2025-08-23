import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, CreditCard, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyBankCards = () => {
  const navigate = useNavigate();
  
  // Static demo bank card for MVP
  const mockBankCard = {
    id: "card_001",
    bank_name: "招商银行",
    account_holder: "李阿姨",
    account_number_last4: "8888",
    is_default: true
  };

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
          <h1 className="text-2xl font-bold text-foreground">我的银行卡</h1>
        </div>

        {/* 绑定的银行卡 */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground">{mockBankCard.bank_name}</span>
                <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  <Star className="w-3 h-3 fill-current" />
                  默认
                </div>
              </div>
              <div className="text-sm text-muted-foreground mb-1">
                {mockBankCard.account_holder}
              </div>
              <div className="text-sm text-muted-foreground">
                ****{mockBankCard.account_number_last4}
              </div>
            </div>
          </div>
        </div>

        {/* 安全提示 */}
        <div className="bg-gradient-to-r from-success/5 to-success/10 border border-success/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground mb-2">💳 资金安全保障</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• 银行卡仅可绑定本人实名账户</div>
                <div>• 卡号信息加密存储，仅保存后四位</div>
                <div>• 如需更换卡号请联系客服 ☎️</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default MyBankCards;