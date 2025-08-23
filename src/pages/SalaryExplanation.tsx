
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, Calculator, Clock, CreditCard, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalaryExplanation = () => {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold text-foreground">薪资说明</h1>
        </div>

        {/* 提成规则 */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">提成规则</h2>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="border-l-4 border-primary pl-4">
              <div className="font-medium text-foreground mb-1">清洁服务</div>
              <div className="text-muted-foreground">基础提成：订单金额的70%</div>
              <div className="text-muted-foreground">优质服务奖励：+5%（用户好评率≥95%）</div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <div className="font-medium text-foreground mb-1">维修服务</div>
              <div className="text-muted-foreground">基础提成：订单金额的65%</div>
              <div className="text-muted-foreground">技能奖励：+10%（专业认证）</div>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <div className="font-medium text-foreground mb-1">配送服务</div>
              <div className="text-muted-foreground">基础提成：订单金额的60%</div>
              <div className="text-muted-foreground">时效奖励：+8%（准时到达率≥90%）</div>
            </div>
          </div>
        </div>

        {/* 结算周期 */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">结算周期</h2>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">结算方式</span>
              <span className="font-medium text-foreground">每日结算</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">到账时间</span>
              <span className="font-medium text-foreground">订单完成后24小时内</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">最低提现金额</span>
              <span className="font-medium text-foreground">50元</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">提现手续费</span>
              <span className="font-medium text-foreground">免费</span>
            </div>
          </div>
        </div>

        {/* 提现说明 */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">提现说明</h2>
          </div>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>提现申请提交后，系统将在1-3个工作日内处理</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>请确保银行卡信息准确，错误信息可能导致提现失败</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>工作日16:00后提交的申请将顺延至下一工作日处理</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>如遇银行系统维护，到账时间可能有所延迟</span>
            </div>
          </div>
        </div>

        {/* 常见问答 */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <HelpCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">常见问答</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="font-medium text-foreground mb-2">Q: 如何提高提成比例？</div>
              <div className="text-sm text-muted-foreground">A: 保持高质量服务，提升用户好评率和准时到达率，考取相关专业认证。</div>
            </div>
            
            <div>
              <div className="font-medium text-foreground mb-2">Q: 提现失败怎么办？</div>
              <div className="text-sm text-muted-foreground">A: 请检查银行卡信息是否正确，如仍有问题请联系客服处理。</div>
            </div>
            
            <div>
              <div className="font-medium text-foreground mb-2">Q: 可以修改绑定的银行卡吗？</div>
              <div className="text-sm text-muted-foreground">A: 可以在"我的银行卡"页面添加新卡片或设置默认提现账户。</div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default SalaryExplanation;
