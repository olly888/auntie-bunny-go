import { useState, useEffect } from "react";
import { ArrowLeft, FileText, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AgreementDialog from "@/components/AgreementDialog";
import { toast } from "@/hooks/use-toast";

interface Agreement {
  id: string;
  title: string;
  version: string;
  required: boolean;
  signed: boolean;
  signedAt?: string;
}

const ProfileAgreements = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [showAgreementDialog, setShowAgreementDialog] = useState(false);
  const [currentAgreementId, setCurrentAgreementId] = useState<string | null>(null);

  // 初始化协议列表
  useEffect(() => {
    const storedProfile = localStorage.getItem("mock_user_profile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);

      // 初始化协议列表
      const agreementList: Agreement[] = [
        {
          id: "service-cooperation",
          title: "服务合作协议",
          version: parsedProfile.agreement_version || "v1.0",
          required: true,
          signed: !!parsedProfile.agreement_signed_at,
          signedAt: parsedProfile.agreement_signed_at || undefined,
        },
        // 未来可以在这里添加更多协议
      ];

      setAgreements(agreementList);
    }
  }, []);

  // 计算签署进度
  const signedCount = agreements.filter((a) => a.signed).length;
  const totalCount = agreements.length;
  const progress = totalCount > 0 ? (signedCount / totalCount) * 100 : 0;
  const allSigned = signedCount === totalCount;

  // 处理签署协议
  const handleSignAgreement = (agreementId: string) => {
    setCurrentAgreementId(agreementId);
    setShowAgreementDialog(true);
  };

  // 签署成功回调
  const handleAgreeSuccess = (agreementId: string) => {
    const now = new Date().toISOString();

    // 更新 localStorage 中的 profile
    const storedProfile = localStorage.getItem("mock_user_profile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      parsedProfile.agreement_signed_at = now;
      parsedProfile.agreement_version = "v1.0";
      localStorage.setItem("mock_user_profile", JSON.stringify(parsedProfile));

      // 触发 storage 事件通知其他组件
      window.dispatchEvent(new Event("storage"));
    }

    // 更新本地状态
    setAgreements((prev) =>
      prev.map((agreement) =>
        agreement.id === agreementId
          ? { ...agreement, signed: true, signedAt: now }
          : agreement
      )
    );

    setShowAgreementDialog(false);
    setCurrentAgreementId(null);

    // 检查是否全部签署完成
    const allSigned = agreements.every((a) => a.id === agreementId || a.signed);
    if (allSigned) {
      toast({
        title: "✅ 协议签署完成",
        description: "所有必需协议已签署，可以继续完成其他新手任务",
      });
    } else {
      toast({
        title: "签署成功",
        description: `${agreements.find((a) => a.id === agreementId)?.title}已签署`,
      });
    }
  };

  // 查看协议内容
  const handleViewAgreement = (agreementId: string) => {
    const agreementContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>服务合作协议</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.8; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { text-align: center; color: #333; }
    h2 { color: #555; margin-top: 30px; }
    p { margin: 15px 0; text-align: justify; }
    .date { text-align: right; color: #666; margin-top: 40px; }
  </style>
</head>
<body>
  <h1>服务合作协议</h1>
  <p><strong>版本：v1.0</strong></p>
  
  <h2>一、协议双方</h2>
  <p>甲方：兔到到平台运营方</p>
  <p>乙方：服务提供者（以下简称"您"）</p>
  
  <h2>二、服务内容</h2>
  <p>1. 您同意通过兔到到平台为用户提供家政、保洁等上门服务。</p>
  <p>2. 您承诺提供的服务符合平台标准，保证服务质量。</p>
  <p>3. 您有义务保护客户隐私，不得泄露客户信息。</p>
  
  <h2>三、权利与义务</h2>
  <p>1. 您有权自主选择接单时间和服务区域。</p>
  <p>2. 您有义务按时完成已接受的订单。</p>
  <p>3. 平台有权对服务质量进行监督和评估。</p>
  
  <h2>四、费用结算</h2>
  <p>1. 服务费用按照平台规则进行结算。</p>
  <p>2. 平台将在每月固定时间进行费用结算。</p>
  <p>3. 您同意平台从服务费中扣除相应的平台服务费。</p>
  
  <h2>五、违约责任</h2>
  <p>1. 如因您的原因导致服务质量问题，您需承担相应责任。</p>
  <p>2. 如您违反本协议，平台有权暂停或终止合作。</p>
  
  <h2>六、其他</h2>
  <p>1. 本协议自您签署之日起生效。</p>
  <p>2. 本协议的解释权归兔到到平台所有。</p>
  
  <p class="date">兔到到平台<br>2024年</p>
</body>
</html>
    `;

    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(agreementContent);
      newWindow.document.close();
    }
  };

  const currentAgreement = agreements.find((a) => a.id === currentAgreementId);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">电子合同</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* 签署进度卡片 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-primary" />
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">签署进度</h2>
              <p className="text-sm text-muted-foreground">
                已签署 {signedCount} / 共 {totalCount} 份
              </p>
            </div>
            {allSigned && (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* 协议列表 */}
        <div className="space-y-3">
          {agreements.map((agreement) => (
            <Card key={agreement.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {agreement.title}
                      </h3>
                      {agreement.required && (
                        <Badge variant="outline" className="text-xs">
                          必填
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      版本：{agreement.version}
                    </p>
                  </div>
                  {agreement.signed ? (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      已签署
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      待签署
                    </Badge>
                  )}
                </div>

                {agreement.signed && agreement.signedAt && (
                  <div className="text-xs text-muted-foreground">
                    签署时间：{new Date(agreement.signedAt).toLocaleString("zh-CN")}
                  </div>
                )}

                <div className="flex gap-2">
                  {agreement.signed ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewAgreement(agreement.id)}
                    >
                      查看内容
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSignAgreement(agreement.id)}
                    >
                      立即签署
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 提示信息 */}
        <Card className="p-4 bg-muted/50">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">温馨提示</p>
              <p>根据《中华人民共和国电子签名法》，电子合同与纸质合同具有同等法律效力。</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 协议签署弹窗 */}
      {currentAgreement && (
        <AgreementDialog
          open={showAgreementDialog}
          agreementId={currentAgreement.id}
          agreementTitle={currentAgreement.title}
          onAgree={() => handleAgreeSuccess(currentAgreement.id)}
          onDisagree={() => {
            setShowAgreementDialog(false);
            setCurrentAgreementId(null);
          }}
        />
      )}
    </div>
  );
};

export default ProfileAgreements;
