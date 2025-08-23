import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, HelpCircle, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      question: "如何开始接单？",
      answer: "完成实名认证和培训课程后，在工作台页面开启\"在线接单\"状态即可开始接收订单。建议先完成基础培训课程，提升服务技能。"
    },
    {
      question: "订单完成后多久能收到款项？",
      answer: "订单完成并获得客户确认后，款项将在1-3个工作日内到账。您可以在\"我的收入\"页面查看详细的收入记录和提现进度。"
    },
    {
      question: "如何提升服务评分？",
      answer: "保持良好的服务态度、按时到达、认真完成服务内容、与客户保持良好沟通。参加培训课程提升专业技能也有助于获得更高评分。"
    },
    {
      question: "忘记密码怎么办？",
      answer: "在登录页面点击\"忘记密码\"，输入手机号码获取验证码重置密码。如仍有问题，请联系客服协助处理。"
    },
    {
      question: "如何修改服务区域？",
      answer: "进入\"个人中心\" > \"个人资料\"，在服务信息中可以添加或删除服务区域。建议选择熟悉且方便到达的区域。"
    },
    {
      question: "培训课程如何参与？",
      answer: "点击\"培训中心\"查看可用课程，选择适合的课程报名参加。完成课程可获得认证，有助于接收更多优质订单。"
    }
  ];


  return (
    <div className="min-h-screen bg-background">
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
          <h1 className="text-lg font-semibold">帮助中心</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              常见问题
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Webmaster */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              联系站长
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 bg-accent/30 rounded-lg">
              <img 
                src="/src/assets/owner-wechat-qr.png" 
                alt="站长企业微信二维码" 
                className="w-32 h-32 mb-3"
              />
              <p className="text-sm font-medium">扫码联系站长</p>
              <p className="text-xs text-muted-foreground">企业微信</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Help;