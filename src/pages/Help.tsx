import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, HelpCircle, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      question: "怎么提升接单量？",
      answer: "保持在线状态、完善个人资料、及时响应订单、按时到达服务地点、完成培训课程提升认证等级，这些都有助于获得更多优质订单推荐。"
    },
    {
      question: "客户临时改约怎么处理？",
      answer: "如客户需要改约，建议主动与客户沟通确认新的服务时间，在订单内添加备注说明情况。如遇到频繁改约，可联系平台客服协调处理。"
    },
    {
      question: "服务用品是否需要自备？",
      answer: "根据服务类型准备常用清洁工具（如抹布、清洁剂等）。特殊或昂贵的清洁用品建议提前与客户确认，避免不必要的费用支出。"
    },
    {
      question: "订单纠纷如何申诉？",
      answer: "遇到订单纠纷时，请在订单详情页的\"服务记录\"中详细记录情况，保留相关证据（如照片、聊天记录），然后联系客服提交申诉。"
    },
    {
      question: "收入如何查看与提现？",
      answer: "在\"我的收入\"页面可查看详细的收入明细和统计。提现需要在\"我的银行卡\"中绑定收款账户，然后申请提现，通常1-3个工作日到账。"
    },
    {
      question: "上门安全注意事项？",
      answer: "到达前请电话确认客户在家，进入室内后及时拍照上传服务凭证，如遇异常情况立即终止服务并联系平台客服或报警求助。"
    },
    {
      question: "培训课程如何参与？",
      answer: "点击\"培训中心\"查看可用课程，选择适合的课程开始学习。完成课程可获得认证，有助于接收更多优质订单。"
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