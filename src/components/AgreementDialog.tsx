import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface AgreementDialogProps {
  open: boolean;
  agreementId?: string;
  agreementTitle?: string;
  onAgree: () => void;
  onDisagree: () => void;
}

const AgreementDialog = ({ 
  open, 
  agreementId = "service-cooperation",
  agreementTitle = "服务合作协议",
  onAgree, 
  onDisagree 
}: AgreementDialogProps) => {
  const [readTime, setReadTime] = useState(0);
  const minReadTime = 10; // 最少阅读10秒
  const canAgree = readTime >= minReadTime;

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setReadTime(prev => Math.min(prev + 1, minReadTime));
    }, 1000);

    return () => {
      clearInterval(interval);
      setReadTime(0);
    };
  }, [open]);

  const progress = (readTime / minReadTime) * 100;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md max-h-[80vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>{agreementTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            请仔细阅读以下协议内容
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!canAgree && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              请阅读 {minReadTime - readTime} 秒后继续
            </p>
          </div>
        )}

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3 text-xs leading-relaxed">
            {/* 甲乙方信息 */}
            <div className="bg-muted/50 p-3 rounded-lg space-y-1.5">
              <div className="flex gap-2">
                <span className="font-medium min-w-[70px]">甲方（平台方）：</span>
                <span>深圳十五分钟网络科技有限公司</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium min-w-[70px]">乙方（服务者）：</span>
                <span className="text-primary font-medium">[您的姓名]</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium min-w-[70px]">身份证号码：</span>
                <span className="text-primary font-medium">[您的身份证号]</span>
              </div>
            </div>

            <p className="text-muted-foreground">
              本《新就业形态服务合作协议》（以下简称"本协议"）由以上双方于 <span className="text-primary font-medium">[签署日期]</span> 在深圳市南山区签订。
            </p>

            <p className="text-muted-foreground border-l-2 border-primary/30 pl-2">
              鉴于甲方合法运营"兔到到"即时家务服务平台（以下简称<strong className="text-foreground">"平台"</strong>），为用户和服务者提供信息匹配、技术支持等服务；乙方作为具备相应服务技能的独立服务提供者，意愿通过平台获取服务机会并获得报酬。
            </p>

            <p className="text-muted-foreground">
              甲乙双方根据《中华人民共和国民法典》及相关法律法规，本着平等、自愿、公平、诚信的原则，经友好协商，达成以下合作协议：
            </p>

            <div className="h-px bg-border my-2" />

            <section>
              <h3 className="font-semibold text-foreground mb-2">第一条：定义</h3>
              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">1.1 平台：</strong> 指由甲方运营的，名为"兔到到"的，包含用户端、服务者端（以下简称"兔管家端"）及管理后台的即时家务服务信息平台。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">1.2 兔管家：</strong> 指符合平台注册要求，使用"兔管家端"小程序接受服务订单并为用户提供服务的乙方。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">第二条：合作关系与性质</h3>
              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">2.1</strong> 双方一致确认并同意，本协议项下的合作关系为平等的民事合作关系，不构成任何形式的劳动关系、劳务关系、雇佣关系或合伙关系。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">2.2</strong> 乙方作为独立的家政服务提供者，自主决定是否在平台注册、上线接单时间、以及是否接受平台推送的服务订单。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">第三条：合作范围与流程</h3>
              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">3.1</strong> 甲方负责提供平台的技术支持与维护，发布来自用户的服务订单信息，并提供订单管理、费用代收代付等服务。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">3.2</strong> 乙方通过"兔管家端"接收订单信息，自主决定是否接单。一旦接单，应按照平台展示的服务项目标准（SOP）和应用内规定的流程完成服务。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">第四条：资质与培训</h3>
              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">4.1</strong> 乙方保证其为平台提供的所有个人资料（包括但不限于身份证信息、健康状况等）均真实、准确、合法、有效。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">4.2</strong> 乙方同意并承诺，在激活接单资格前，必须完成平台提供的线上服务标准培训与考核。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">第五条：服务费用与结算</h3>
              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">5.1</strong> 每笔订单的服务费用由平台根据市场价格确定，并在订单推送时向乙方明确展示。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">5.2</strong> 乙方在此不可撤销地授权甲方，作为乙方向用户收取服务费用的唯一代收方。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">5.3</strong> 平台以周为单位为乙方结算上一自然周（周一至周日）内所有已完成订单的服务费用。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">第六条：甲方的权利与义务</h3>
              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">6.1</strong> 审核乙方的注册资料，并决定是否与乙方建立合作关系。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">6.2</strong> 根据平台规则，为乙方提供服务培训材料和技术支持。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">6.3</strong> 按照本协议约定，及时、准确地与乙方进行费用结算。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">6.4</strong> 有权根据乙方的服务质量、用户评价、违规情况等，调整其在平台内的信用评级或派单优先级。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">第七条：乙方的权利与义务</h3>
              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">7.1</strong> 按照本协议约定，获得提供服务的报酬。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">7.2</strong> 严格遵守平台的所有服务规范、操作流程（SOP）和行为准则。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">7.3</strong> 服务期间，应保持专业、友好的服务态度，维护平台及自身的良好形象。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">7.4</strong> 对服务过程中获悉的任何用户信息负有严格的保密义务。
                </p>
                <div className="bg-destructive/10 border border-destructive/30 rounded p-2">
                  <p className="text-destructive font-medium">
                    <strong>7.5【核心条款】</strong> 乙方承诺绝不以任何形式引导、暗示或接受用户进行绕开平台的私下交易（"跳单"）。一经发现，甲方有权立即单方面解除本协议，永久封停乙方账户。
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">第八条：责任承担</h3>
              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">8.1</strong> 因乙方在服务过程中存在故意或重大过失，导致用户人身或财产受到损害的，由乙方独立承担全部赔偿责任。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">8.2</strong> 因甲方平台技术故障，导致订单信息错误、费用计算错误等，给乙方造成直接经济损失的，由甲方在故障范围内承担责任。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">第九条：协议期限与解除</h3>
              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">9.1</strong> 本协议自乙方在线点击同意之日起生效，有效期一年，到期后若双方无异议则自动续期。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">9.2</strong> 任何一方提前7日书面通知对方，均可解除本协议。若乙方严重违反本协议约定（尤其是第七条第五款），甲方有权单方面立即解除协议。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">第十条：争议解决</h3>
              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">10.1</strong> 因本协议引起的任何争议，双方应友好协商解决；协商不成的，任何一方均有权向甲方所在地有管辖权的人民法院提起诉讼。
                </p>
              </div>
            </section>

            <div className="h-px bg-border my-2" />

            <section className="bg-muted/30 p-3 rounded space-y-2">
              <h3 className="font-semibold text-foreground text-center text-sm">
                附件一：《兔管家服务安全与行为准则承诺书》
              </h3>
              
              <p className="text-muted-foreground">
                本人作为"兔到到"平台的独立合作服务者，郑重作出以下承诺：
              </p>

              <div className="space-y-1.5 pl-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">专业形象：</strong> 服务期间，按平台要求着装，仪表整洁，精神饱满。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">服务礼仪：</strong> 使用文明用语，态度亲切，不大声喧哗。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">用户隐私保护：</strong> 绝不主动询问用户隐私，绝不在用户家中进行任何形式的拍照、录像、录音。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">财产物品安全：</strong> 爱护用户家中物品，轻拿轻放，如遇用户贵重物品，主动提醒用户收管。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">禁止私下交易：</strong> 坚决拒绝任何形式的私下交易（"跳单"）请求。
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">人身安全：</strong> 服务期间注意用电、用水、用气安全，不进行任何危险操作。
                </p>
              </div>

              <p className="text-muted-foreground pt-2 border-t">
                我已完整阅读、充分理解并同意严格遵守以上所有条款。
              </p>
            </section>

            <div className="bg-primary/5 border border-primary/20 rounded p-3">
              <h4 className="font-semibold text-foreground mb-2 text-center text-sm">【电子签署确认】</h4>
              <p className="text-muted-foreground">
                <strong className="text-foreground">乙方确认：</strong>本人在同意本协议前，已完整阅读、充分理解并自愿接受本协议及附件的全部条款内容。乙方的在线点击"同意"、"接受"或勾选"我已阅读并同意"并继续使用平台的行为，即视为乙方本人真实意愿的表示，构成对本协议及附件的有效签署，具有与手写签名同等的法律效力。
              </p>
            </div>

            <div className="pt-2 border-t text-center">
              <p className="text-muted-foreground">
                版本：v2.0 | 最后更新时间：2025年1月17日
              </p>
            </div>
          </div>
        </ScrollArea>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDisagree}>不同意</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onAgree}
            disabled={!canAgree}
          >
            {canAgree ? '同意并签署' : `${minReadTime - readTime}秒后可操作`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AgreementDialog;