import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LegalServiceAgreement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card shadow-card p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">服务协议</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>兔到到与服务人员合作服务协议</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. 定义与适用范围</h3>
              <p className="text-muted-foreground leading-relaxed">
                本协议是兔到到平台与注册服务人员（以下简称"阿姨"）之间关于家庭服务合作的法律协议。
                通过注册成为平台服务人员，即表示同意接受本协议的所有条款。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. 合作模式与服务范围</h3>
              <p className="text-muted-foreground leading-relaxed">
                平台为阿姨提供订单信息和客户匹配服务，阿姨提供专业的家庭清洁、保洁、维护等上门服务。
                双方建立合作关系，共同为客户提供优质便捷的家庭服务体验。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. 订单与服务履约</h3>
              <p className="text-muted-foreground leading-relaxed">
                阿姨应及时响应订单邀请，按约定时间到达服务地点，按照服务标准完成工作。
                如遇特殊情况需要改约或取消，应提前与客户和平台沟通协调。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. 收入结算与提现</h3>
              <p className="text-muted-foreground leading-relaxed">
                服务费用按照平台标准结算，完成服务并获得客户确认后进入结算周期。
                阿姨可通过平台提现功能申请收入提取，平台将按约定时间转账至绑定银行账户。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5. 行为规范与处罚</h3>
              <p className="text-muted-foreground leading-relaxed">
                阿姨应遵守职业道德，诚信服务，不得无故爽约、虚假打卡或从事违规行为。
                违反规定的行为将面临警告、暂停服务、扣除费用等处罚措施。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">6. 安全与保险</h3>
              <p className="text-muted-foreground leading-relaxed">
                阿姨应严格按照安全操作规范作业，注意人身和财产安全。
                平台将为注册阿姨购买相应的保险服务，如发生意外事故应及时报案并联系平台处理。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">7. 信息与隐私保护</h3>
              <p className="text-muted-foreground leading-relaxed">
                双方应严格保护客户隐私和个人信息安全，不得泄露、传播或用于其他用途。
                阿姨在服务过程中获取的客户信息应严格保密。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">8. 知识产权与品牌使用</h3>
              <p className="text-muted-foreground leading-relaxed">
                平台拥有"兔到到"品牌和相关知识产权，阿姨在服务中可使用平台品牌标识，
                但不得擅自用于其他商业用途或从事有损品牌形象的行为。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">9. 协议期限、变更与解除</h3>
              <p className="text-muted-foreground leading-relaxed">
                本协议自签署之日起生效，双方均可提前30天通知对方解除合作关系。
                平台有权根据业务发展需要修改协议条款，修改后将及时通知阿姨。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">10. 违约与争议解决</h3>
              <p className="text-muted-foreground leading-relaxed">
                因履行本协议发生的争议，双方应友好协商解决。协商不成的，
                提交平台所在地人民法院管辖，适用中华人民共和国法律。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">11. 其他条款</h3>
              <p className="text-muted-foreground leading-relaxed">
                本协议未尽事宜，双方可另行协商确定。协议条款如与法律法规冲突，
                以法律法规为准。平台联系方式和通知以应用内消息为准。
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                最后更新时间：2024年12月28日
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalServiceAgreement;