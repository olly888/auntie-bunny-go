import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettlementRules = () => {
  const navigate = useNavigate();

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
          <h1 className="text-lg font-semibold text-foreground">结算规则说明</h1>
          <div className="w-9" />
        </div>

        <div className="p-4 space-y-6">
          {/* 结算周期 */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-foreground">
                <FileText className="w-5 h-5" />
                结算周期
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground mb-1">订单完成即时到账</p>
                  <p className="text-muted-foreground">
                    订单服务完成后，提成金额会立即计入您的可提现余额
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 提现规则 */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-foreground">
                <FileText className="w-5 h-5" />
                提现规则
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-foreground mb-2">提现频率</h3>
                <p className="text-muted-foreground">每周可申请提现1次</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">最低提现金额</h3>
                <p className="text-muted-foreground">单次提现最低金额为 ¥10</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">到账时间</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>提交申请后，平台将在1个工作日内完成审核</li>
                  <li>审核通过后，预计2个工作日内到账</li>
                  <li>节假日可能顺延，请耐心等待</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">提现手续费</h3>
                <p className="text-muted-foreground">目前平台不收取任何提现手续费</p>
              </div>
            </CardContent>
          </Card>

          {/* 特殊说明 */}
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-amber-800 dark:text-amber-400">
                <AlertCircle className="w-5 h-5" />
                特殊说明
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-amber-800 dark:text-amber-400">
              <div>
                <h3 className="font-medium mb-1">直营员工</h3>
                <p>直营员工的薪资由平台统一发放，不适用提现功能</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">实名认证</h3>
                <p>提现前需完成实名认证并绑定提现账户（微信钱包或银行卡）</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">异常情况</h3>
                <p>如遇提现失败或长时间未到账，请及时联系客服处理</p>
              </div>
            </CardContent>
          </Card>

          {/* 提成标准 */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-foreground">
                <FileText className="w-5 h-5" />
                提成标准
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                提成比例根据服务类型、服务时长、服务质量等因素综合计算，具体标准请咨询所属门店或平台客服。
              </p>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-foreground font-medium mb-1">提示</p>
                <p className="text-muted-foreground text-xs">
                  提升服务评分、完成技能认证、参与培训课程等都有助于获得更高的提成比例和更多优质订单
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettlementRules;
