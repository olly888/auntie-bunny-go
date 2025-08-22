import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LegalPrivacyPolicy = () => {
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
          <h1 className="text-lg font-semibold">隐私政策</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>兔到到隐私政策</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. 信息收集</h3>
              <p className="text-muted-foreground leading-relaxed">
                我们会收集您主动提供的信息，如注册信息、联系方式等。
                我们也会自动收集一些信息，如设备信息、使用记录等，以改善服务质量。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. 信息使用</h3>
              <p className="text-muted-foreground leading-relaxed">
                我们使用收集的信息来提供、维护和改进我们的服务。
                我们也可能使用这些信息来与您沟通、发送重要通知或营销信息。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. 信息共享</h3>
              <p className="text-muted-foreground leading-relaxed">
                我们不会向第三方出售、出租或以其他方式转让您的个人信息。
                除非获得您的同意，或法律要求，或为了保护我们的权利。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. 信息安全</h3>
              <p className="text-muted-foreground leading-relaxed">
                我们采用业界标准的安全措施来保护您的个人信息。
                包括数据加密、访问控制、定期安全审计等。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5. 您的权利</h3>
              <p className="text-muted-foreground leading-relaxed">
                您有权访问、更正、删除您的个人信息。
                您也可以选择不接收我们的营销信息。如需帮助，请联系客服。
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">6. Cookie使用</h3>
              <p className="text-muted-foreground leading-relaxed">
                我们使用Cookie来改善用户体验、分析网站使用情况。
                您可以通过浏览器设置来管理Cookie偏好。
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

export default LegalPrivacyPolicy;