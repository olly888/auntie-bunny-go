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
            <CardTitle>兔到到服务协议</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. 服务条款</h3>
              <p className="text-muted-foreground leading-relaxed">
                欢迎使用兔到到服务平台。本协议是您与我们之间关于使用服务的法律协议。
                通过注册或使用我们的服务，您表示同意接受本协议的所有条款。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. 服务内容</h3>
              <p className="text-muted-foreground leading-relaxed">
                兔到到为用户提供家庭清洁、维修、保养等上门服务的预约和管理平台。
                我们致力于为用户提供优质、便捷的服务体验。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. 用户责任</h3>
              <p className="text-muted-foreground leading-relaxed">
                用户应当遵守相关法律法规，诚信使用服务，不得从事任何违法违规活动。
                用户应当保护好自己的账号信息，对账号下的所有活动负责。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. 服务质量</h3>
              <p className="text-muted-foreground leading-relaxed">
                我们将尽最大努力确保服务质量，但不对服务的连续性、准确性、完整性做出保证。
                如遇服务问题，请及时联系客服处理。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5. 协议更新</h3>
              <p className="text-muted-foreground leading-relaxed">
                我们保留随时修改本协议的权利。协议修改后，我们会通过适当方式通知用户。
                继续使用服务即表示您同意接受修改后的协议。
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                最后更新时间：2024年1月1日
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalServiceAgreement;