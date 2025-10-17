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
  onAgree: () => void;
  onDisagree: () => void;
}

const AgreementDialog = ({ open, onAgree, onDisagree }: AgreementDialogProps) => {
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
          <AlertDialogTitle>服务合作协议</AlertDialogTitle>
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
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">第一条 协议目的</h3>
              <p className="text-muted-foreground">
                本协议旨在明确兔到到平台（以下简称"平台"）与服务人员（以下简称"乙方"）之间的权利义务关系，保障双方合法权益。
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">第二条 服务内容</h3>
              <p className="text-muted-foreground mb-2">
                乙方同意通过平台接受客户的服务需求，提供以下服务：
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>家庭保洁服务</li>
                <li>深度清洁服务</li>
                <li>其他经平台认可的家政服务</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">第三条 服务标准</h3>
              <p className="text-muted-foreground mb-2">
                乙方应当：
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>按时到达服务地点，不得无故迟到或缺席</li>
                <li>穿着整洁，保持良好的个人形象</li>
                <li>使用礼貌用语，尊重客户</li>
                <li>认真完成服务，确保质量达标</li>
                <li>保护客户隐私，不得泄露客户信息</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">第四条 服务费用</h3>
              <p className="text-muted-foreground">
                平台根据服务类型、时长等因素确定服务费用。乙方完成服务后，平台将按照约定的结算规则支付服务费用。平台有权收取一定比例的平台服务费。
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">第五条 违约责任</h3>
              <p className="text-muted-foreground mb-2">
                如乙方出现以下情况，平台有权采取相应措施：
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>无故取消订单：警告或暂停接单权限</li>
                <li>服务质量不达标：客户投诉核实后，扣减服务费用</li>
                <li>泄露客户隐私：永久封禁账号并追究法律责任</li>
                <li>恶意刷单或作弊：永久封禁账号</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">第六条 保险保障</h3>
              <p className="text-muted-foreground">
                平台为乙方购买意外伤害保险，保障乙方在服务过程中的安全。保险理赔按照保险公司规定执行。
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">第七条 协议变更</h3>
              <p className="text-muted-foreground">
                平台有权根据业务需要修改本协议，修改后的协议将在平台公告。乙方继续使用平台服务视为同意修改后的协议。
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">第八条 其他</h3>
              <p className="text-muted-foreground">
                本协议未尽事宜，双方可另行协商解决。如发生争议，应友好协商；协商不成的，任何一方可向平台所在地人民法院提起诉讼。
              </p>
            </section>

            <section className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                本协议版本：v1.0
              </p>
              <p className="text-xs text-muted-foreground">
                生效日期：2024年1月1日
              </p>
            </section>
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