import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, ExternalLink, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Insurance = () => {
  const navigate = useNavigate();
  
  const insuranceProducts = [
    {
      id: 1,
      name: "意外伤害保险",
      provider: "平安保险",
      coverage: "最高50万",
      monthlyPremium: "15元/月",
      features: ["工作意外保障", "医疗费用报销", "24小时理赔服务"],
      recommended: true,
      link: "https://baoxian.pingan.com/accident"
    },
    {
      id: 2,
      name: "百万医疗险",
      provider: "平安保险", 
      coverage: "最高600万",
      monthlyPremium: "29元/月",
      features: ["住院医疗保障", "特殊门诊保障", "药品费用保障", "无免赔额"],
      recommended: true,
      link: "https://baoxian.pingan.com/medical"
    },
    {
      id: 3,
      name: "重疾险",
      provider: "平安保险",
      coverage: "最高30万",
      monthlyPremium: "85元/月", 
      features: ["100种重大疾病", "轻症疾病保障", "保费豁免", "身故保障"],
      recommended: false,
      link: "https://baoxian.pingan.com/critical"
    },
    {
      id: 4,
      name: "家政责任险",
      provider: "平安保险",
      coverage: "最高20万",
      monthlyPremium: "8元/月",
      features: ["财产损失保障", "第三方责任", "法律费用保障"],
      recommended: true,
      link: "https://baoxian.pingan.com/liability"
    }
  ];

  const handleProductClick = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card shadow-card p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">我的保险</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              保险保障
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              为了您的工作安全和家庭保障，我们与平安保险合作，为兔到到员工提供专业的保险产品。
            </p>
            <div className="bg-accent/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">温馨提示</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    点击产品卡片将跳转到平安保险官方页面，请仔细阅读保险条款。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Products */}
        <div className="space-y-4">
          {insuranceProducts.map((product) => (
            <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Product Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        {product.recommended && (
                          <Badge variant="destructive" className="text-xs">推荐</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{product.provider}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">{product.coverage}</div>
                      <div className="text-sm text-muted-foreground">{product.monthlyPremium}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">保障内容：</p>
                    <div className="grid grid-cols-1 gap-1">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full"
                    variant={product.recommended ? "default" : "outline"}
                    onClick={() => handleProductClick(product.link)}
                  >
                    <span className="mr-2">立即购买</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">免责声明</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                1. 本页面展示的保险产品由平安保险公司提供，兔到到仅作为推荐平台。<br/>
                2. 具体保险条款、理赔流程等以平安保险官方页面为准。<br/>
                3. 购买前请仔细阅读保险条款，了解保障范围和免责条款。<br/>
                4. 如有疑问，请直接联系平安保险客服：95511。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insurance;