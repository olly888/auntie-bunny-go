import { useState, useEffect } from "react";
import { ArrowLeft, FileText, CheckCircle2, Clock, PenLine } from "lucide-react";
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
  signatureUrl?: string;
  signatureDevice?: string;
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
          title: "新就业形态服务合作协议",
          version: parsedProfile.agreement_version || "v2.0",
          required: true,
          signed: !!parsedProfile.agreement_signed_at,
          signedAt: parsedProfile.agreement_signed_at || undefined,
          signatureUrl: parsedProfile.signature_url || undefined,
          signatureDevice: parsedProfile.signature_device || undefined,
        },
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
  const handleAgreeSuccess = (agreementId: string, signatureDataUrl: string, deviceInfo: string) => {
    const now = new Date().toISOString();

    // 更新 localStorage 中的 profile
    const storedProfile = localStorage.getItem("mock_user_profile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      parsedProfile.agreement_signed_at = now;
      parsedProfile.agreement_version = "v2.0";
      parsedProfile.signature_url = signatureDataUrl;
      parsedProfile.signature_device = deviceInfo;
      localStorage.setItem("mock_user_profile", JSON.stringify(parsedProfile));

      // 触发 storage 事件通知其他组件
      window.dispatchEvent(new Event("storage"));
    }

    // 更新本地状态
    setAgreements((prev) =>
      prev.map((agreement) =>
        agreement.id === agreementId
          ? { 
              ...agreement, 
              signed: true, 
              signedAt: now,
              signatureUrl: signatureDataUrl,
              signatureDevice: deviceInfo,
            }
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
  const handleViewAgreement = (agreement: Agreement) => {
    // 从 localStorage 获取用户信息
    const userProfile = localStorage.getItem("mock_user_profile");
    let userName = "___________";
    let idNumber = "___________";
    let signedAt = agreement.signedAt || "";
    let signatureUrl = agreement.signatureUrl || "";
    let deviceInfo: any = {};
    
    if (userProfile) {
      const data = JSON.parse(userProfile);
      userName = data.name || "___________";
      idNumber = data.id_number || "___________";
      
      if (data.signature_device) {
        try {
          deviceInfo = JSON.parse(data.signature_device);
        } catch (e) {
          // ignore
        }
      }
    }

    const signDate = signedAt 
      ? new Date(signedAt).toLocaleString('zh-CN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : "___________";

    const agreementContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>新就业形态服务合作协议</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", sans-serif;
      line-height: 1.8; 
      padding: 40px 20px; 
      max-width: 800px; 
      margin: 0 auto;
      color: #333;
      background: #f9fafb;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 { 
      text-align: center; 
      color: #1a1a1a;
      font-size: 24px;
      margin-bottom: 30px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 15px;
    }
    h2 { 
      color: #374151; 
      margin-top: 30px;
      font-size: 16px;
      font-weight: 600;
    }
    h3 {
      color: #1f2937;
      font-size: 15px;
      margin: 20px 0 10px 0;
    }
    p { 
      margin: 12px 0; 
      text-align: justify;
      font-size: 14px;
      color: #4b5563;
    }
    .info-box {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 13px;
    }
    .info-box div {
      margin: 8px 0;
    }
    .highlight {
      color: #dc2626;
      font-weight: 600;
    }
    .emphasis {
      color: #059669;
      font-weight: 500;
    }
    .warning {
      background: #fef2f2;
      border: 1px solid #fecaca;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
    }
    .warning strong {
      color: #dc2626;
    }
    .attachment {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .signature-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .signature-image {
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      max-width: 300px;
      margin: 10px 0;
    }
    ul {
      padding-left: 25px;
    }
    li {
      margin: 8px 0;
      color: #4b5563;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 12px;
    }
    .device-info {
      background: #f3f4f6;
      padding: 10px;
      border-radius: 4px;
      font-size: 11px;
      color: #6b7280;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>新就业形态服务合作协议</h1>
    
    <div class="info-box">
      <div><strong>甲方（平台方）：</strong>深圳十五分钟网络科技有限公司</div>
      <div><strong>乙方（服务者）：</strong><span class="emphasis">${userName}</span></div>
      <div><strong>身份证号码：</strong><span class="emphasis">${idNumber}</span></div>
    </div>

    <p>本《新就业形态服务合作协议》（以下简称"本协议"）由以上双方于 <span class="emphasis">${signDate}</span> 在深圳市南山区签订。</p>

    <p style="border-left: 3px solid #10b981; padding-left: 15px; margin: 20px 0;">
      鉴于甲方合法运营"兔到到"即时家务服务平台（以下简称<strong>"平台"</strong>），为用户和服务者提供信息匹配、技术支持等服务；乙方作为具备相应服务技能的独立服务提供者，意愿通过平台获取服务机会并获得报酬。
    </p>

    <p>甲乙双方根据《中华人民共和国民法典》及相关法律法规，本着平等、自愿、公平、诚信的原则，经友好协商，达成以下合作协议：</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

    <h2>第一条：定义</h2>
    <p><strong>1.1 平台：</strong>指由甲方运营的，名为"兔到到"的，包含用户端、服务者端（以下简称"兔管家端"）及管理后台的即时家务服务信息平台。</p>
    <p><strong>1.2 兔管家：</strong>指符合平台注册要求，使用"兔管家端"小程序接受服务订单并为用户提供服务的乙方。</p>

    <h2>第二条：合作关系与性质</h2>
    <p><strong>2.1</strong> 双方一致确认并同意，本协议项下的合作关系为平等的民事合作关系，不构成任何形式的劳动关系、劳务关系、雇佣关系或合伙关系。</p>
    <p><strong>2.2</strong> 乙方作为独立的家政服务提供者，自主决定是否在平台注册、上线接单时间、以及是否接受平台推送的服务订单。</p>

    <h2>第三条：合作范围与流程</h2>
    <p><strong>3.1</strong> 甲方负责提供平台的技术支持与维护，发布来自用户的服务订单信息，并提供订单管理、费用代收代付等服务。</p>
    <p><strong>3.2</strong> 乙方通过"兔管家端"接收订单信息，自主决定是否接单。一旦接单，应按照平台展示的服务项目标准（SOP）和应用内规定的流程完成服务。</p>

    <h2>第四条：资质与培训</h2>
    <p><strong>4.1</strong> 乙方保证其为平台提供的所有个人资料（包括但不限于身份证信息、健康状况等）均真实、准确、合法、有效。</p>
    <p><strong>4.2</strong> 乙方同意并承诺，在激活接单资格前，必须完成平台提供的线上服务标准培训与考核。</p>

    <h2>第五条：服务费用与结算</h2>
    <p><strong>5.1</strong> 每笔订单的服务费用由平台根据市场价格确定，并在订单推送时向乙方明确展示。</p>
    <p><strong>5.2</strong> 乙方在此不可撤销地授权甲方，作为乙方向用户收取服务费用的唯一代收方。</p>
    <p><strong>5.3</strong> 平台以周为单位为乙方结算上一自然周（周一至周日）内所有已完成订单的服务费用。</p>

    <h2>第六条：甲方的权利与义务</h2>
    <p><strong>6.1</strong> 审核乙方的注册资料，并决定是否与乙方建立合作关系。</p>
    <p><strong>6.2</strong> 根据平台规则，为乙方提供服务培训材料和技术支持。</p>
    <p><strong>6.3</strong> 按照本协议约定，及时、准确地与乙方进行费用结算。</p>
    <p><strong>6.4</strong> 有权根据乙方的服务质量、用户评价、违规情况等，调整其在平台内的信用评级或派单优先级。</p>

    <h2>第七条：乙方的权利与义务</h2>
    <p><strong>7.1</strong> 按照本协议约定，获得提供服务的报酬。</p>
    <p><strong>7.2</strong> 严格遵守平台的所有服务规范、操作流程（SOP）和行为准则。</p>
    <p><strong>7.3</strong> 服务期间，应保持专业、友好的服务态度，维护平台及自身的良好形象。</p>
    <p><strong>7.4</strong> 对服务过程中获悉的任何用户信息负有严格的保密义务。</p>
    
    <div class="warning">
      <p><strong>7.5【核心条款】</strong> 乙方承诺绝不以任何形式引导、暗示或接受用户进行绕开平台的私下交易（"跳单"）。一经发现，甲方有权立即单方面解除本协议，永久封停乙方账户。</p>
    </div>

    <h2>第八条：责任承担</h2>
    <p><strong>8.1</strong> 因乙方在服务过程中存在故意或重大过失，导致用户人身或财产受到损害的，由乙方独立承担全部赔偿责任。</p>
    <p><strong>8.2</strong> 因甲方平台技术故障，导致订单信息错误、费用计算错误等，给乙方造成直接经济损失的，由甲方在故障范围内承担责任。</p>

    <h2>第九条：协议期限与解除</h2>
    <p><strong>9.1</strong> 本协议自乙方在线点击同意之日起生效，有效期一年，到期后若双方无异议则自动续期。</p>
    <p><strong>9.2</strong> 任何一方提前7日书面通知对方，均可解除本协议。</p>

    <h2>第十条：争议解决</h2>
    <p><strong>10.1</strong> 因本协议引起的任何争议，双方应友好协商解决；协商不成的，任何一方均有权向甲方所在地有管辖权的人民法院提起诉讼。</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

    <div class="attachment">
      <h3 style="text-align: center; color: #1f2937;">附件一：《兔管家服务安全与行为准则承诺书》</h3>
      
      <p>本人 <span class="emphasis">${userName}</span> 作为"兔到到"平台的独立合作服务者，郑重作出以下承诺：</p>

      <ul>
        <li><strong>专业形象：</strong>服务期间，按平台要求着装，仪表整洁，精神饱满。</li>
        <li><strong>服务礼仪：</strong>使用文明用语，态度亲切，不大声喧哗。</li>
        <li><strong>用户隐私保护：</strong>绝不主动询问用户隐私，绝不在用户家中进行任何形式的拍照、录像、录音。</li>
        <li><strong>财产物品安全：</strong>爱护用户家中物品，轻拿轻放，如遇用户贵重物品，主动提醒用户收管。</li>
        <li><strong>禁止私下交易：</strong>坚决拒绝任何形式的私下交易（"跳单"）请求。</li>
        <li><strong>人身安全：</strong>服务期间注意用电、用水、用气安全，不进行任何危险操作。</li>
      </ul>

      <p style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 15px;">
        我已完整阅读、充分理解并同意严格遵守以上所有条款。
      </p>
    </div>

    ${agreement.signed && signatureUrl ? `
    <div class="signature-box">
      <h3 style="text-align: center;">【电子签署确认】</h3>
      <p><strong>签署状态：</strong><span style="color: #059669;">✓ 已签署</span></p>
      <p><strong>签署时间：</strong>${signDate}</p>
      <p><strong>乙方签名：</strong></p>
      <img src="${signatureUrl}" alt="签名" class="signature-image" />
      ${deviceInfo.platform ? `
      <div class="device-info">
        <strong>签署设备信息：</strong><br/>
        设备：${deviceInfo.platform || '未知'}<br/>
        屏幕：${deviceInfo.screenSize || '未知'}<br/>
        时间：${deviceInfo.timestamp || signDate}
      </div>
      ` : ''}
    </div>
    ` : `
    <div class="signature-box">
      <h3 style="text-align: center;">【电子签署确认】</h3>
      <p><strong>签署状态：</strong><span style="color: #dc2626;">✗ 待签署</span></p>
    </div>
    `}

    <div class="footer">
      <p>版本：v2.0 | 最后更新时间：2025年1月17日</p>
      <p>深圳十五分钟网络科技有限公司</p>
    </div>
  </div>
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

                {/* 签名预览 */}
                {agreement.signed && agreement.signatureUrl && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      签署时间：{agreement.signedAt ? new Date(agreement.signedAt).toLocaleString('zh-CN') : '-'}
                    </p>
                    <div className="flex items-center gap-2">
                      <PenLine className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">我的签名：</span>
                    </div>
                    <img 
                      src={agreement.signatureUrl} 
                      alt="签名" 
                      className="mt-2 max-h-16 border border-border rounded bg-white"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewAgreement(agreement)}
                  >
                    查看协议
                  </Button>
                  {!agreement.signed && (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSignAgreement(agreement.id)}
                    >
                      <PenLine className="w-4 h-4 mr-1" />
                      手写签署
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 提示信息 */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>根据《电子签名法》，可靠的电子签名与手写签名具有同等法律效力</p>
          <p>您的签名将被安全保存，并用于协议的法律效力证明</p>
        </div>
      </div>

      {/* 签署协议弹窗 */}
      {currentAgreement && (
        <AgreementDialog
          open={showAgreementDialog}
          agreementId={currentAgreement.id}
          agreementTitle={currentAgreement.title}
          onAgree={(signatureDataUrl, deviceInfo) => 
            handleAgreeSuccess(currentAgreement.id, signatureDataUrl, deviceInfo)
          }
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
