import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ProfileAgreements = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("mock_user_profile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const agreementSigned = profile?.agreement_signed_at;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">电子合同</h1>
            <p className="text-sm text-muted-foreground">查看已签署的协议</p>
          </div>
        </div>

        {/* Agreement List */}
        {agreementSigned ? (
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">服务合作协议</h3>
                  <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    已签署
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  签署时间：{new Date(agreementSigned).toLocaleString('zh-CN')}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  版本：{profile?.agreement_version || 'v1.0'}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // 显示协议内容
                    const agreementWindow = window.open('', '_blank');
                    if (agreementWindow) {
                      agreementWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>服务合作协议</title>
                          <meta charset="utf-8">
                          <style>
                            body { 
                              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                              max-width: 800px;
                              margin: 40px auto;
                              padding: 20px;
                              line-height: 1.6;
                            }
                            h1 { color: #333; }
                            h3 { color: #666; margin-top: 24px; }
                            p, li { color: #666; }
                            .meta { color: #999; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 40px; }
                          </style>
                        </head>
                        <body>
                          <h1>服务合作协议</h1>
                          <p><strong>签署时间：</strong>${new Date(agreementSigned).toLocaleString('zh-CN')}</p>
                          <p><strong>协议版本：</strong>${profile?.agreement_version || 'v1.0'}</p>
                          
                          <h3>第一条 协议目的</h3>
                          <p>本协议旨在明确兔到到平台（以下简称"平台"）与服务人员（以下简称"乙方"）之间的权利义务关系，保障双方合法权益。</p>

                          <h3>第二条 服务内容</h3>
                          <p>乙方同意通过平台接受客户的服务需求，提供以下服务：</p>
                          <ul>
                            <li>家庭保洁服务</li>
                            <li>深度清洁服务</li>
                            <li>其他经平台认可的家政服务</li>
                          </ul>

                          <h3>第三条 服务标准</h3>
                          <p>乙方应当：</p>
                          <ul>
                            <li>按时到达服务地点，不得无故迟到或缺席</li>
                            <li>穿着整洁，保持良好的个人形象</li>
                            <li>使用礼貌用语，尊重客户</li>
                            <li>认真完成服务，确保质量达标</li>
                            <li>保护客户隐私，不得泄露客户信息</li>
                          </ul>

                          <h3>第四条 服务费用</h3>
                          <p>平台根据服务类型、时长等因素确定服务费用。乙方完成服务后，平台将按照约定的结算规则支付服务费用。平台有权收取一定比例的平台服务费。</p>

                          <h3>第五条 违约责任</h3>
                          <p>如乙方出现以下情况，平台有权采取相应措施：</p>
                          <ul>
                            <li>无故取消订单：警告或暂停接单权限</li>
                            <li>服务质量不达标：客户投诉核实后，扣减服务费用</li>
                            <li>泄露客户隐私：永久封禁账号并追究法律责任</li>
                            <li>恶意刷单或作弊：永久封禁账号</li>
                          </ul>

                          <h3>第六条 保险保障</h3>
                          <p>平台为乙方购买意外伤害保险，保障乙方在服务过程中的安全。保险理赔按照保险公司规定执行。</p>

                          <h3>第七条 协议变更</h3>
                          <p>平台有权根据业务需要修改本协议，修改后的协议将在平台公告。乙方继续使用平台服务视为同意修改后的协议。</p>

                          <h3>第八条 其他</h3>
                          <p>本协议未尽事宜，双方可另行协商解决。如发生争议，应友好协商；协商不成的，任何一方可向平台所在地人民法院提起诉讼。</p>

                          <div class="meta">
                            <p>本协议版本：v1.0</p>
                            <p>生效日期：2024年1月1日</p>
                          </div>
                        </body>
                        </html>
                      `);
                      agreementWindow.document.close();
                    }
                  }}
                >
                  查看协议内容
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">暂无已签署的协议</p>
            <p className="text-sm text-muted-foreground">
              首次上线接单时需要签署服务合作协议
            </p>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-4 bg-accent/5">
          <p className="text-sm text-muted-foreground">
            💡 电子合同与纸质合同具有同等法律效力。如需纸质版本，请联系客服申请。
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ProfileAgreements;