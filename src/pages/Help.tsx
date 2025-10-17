import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Phone, HelpCircle, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useMockAuth } from "@/hooks/useMockAuth";
import ownerQr from "@/assets/owner-wechat-qr.png";

const Help = () => {
  const navigate = useNavigate();
  const { state: mockState } = useMockAuth();
  const [appealType, setAppealType] = useState("");
  const [appealContent, setAppealContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCall = () => {
    window.location.href = "tel:400-8888-888";
  };

  const handleSubmitAppeal = async () => {
    if (!appealType) {
      toast.error("请选择申诉类型");
      return;
    }
    
    if (!appealContent.trim()) {
      toast.error("请输入申诉内容");
      return;
    }

    // 检查是否为演示用户
    if (mockState.user && mockState.user.id.startsWith('user_')) {
      toast.info("演示账户无法提交真实申诉，请联系站长");
      return;
    }

    setIsSubmitting(true);

    try {
      // 生成工单号
      const ticketNumber = `APP${Date.now()}`;
      
      toast.success("申诉已提交", {
        description: `工单号：${ticketNumber}，请在"申诉进度"页面查看处理状态`
      });

      // 清空表单
      setAppealType("");
      setAppealContent("");
      
      // 3秒后跳转到申诉进度页
      setTimeout(() => {
        navigate("/appeal-progress");
      }, 3000);
    } catch (error) {
      toast.error("提交失败，请稍后重试");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">联系与帮助</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">

        {/* 平台规则 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              平台规则
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-foreground mb-2">服务标准</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>服务前需完成实名认证和技能培训</li>
                <li>服务过程中需佩戴工作证，着装整洁</li>
                <li>严格按照SOP操作流程完成服务</li>
                <li>服务完成后需拍照上传，记录服务质量</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">结算规则</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>订单完成后，提成即时到账可提现余额</li>
                <li>每周可申请提现1次，最低提现金额¥10</li>
                <li>提现申请将在1个工作日内审核，2个工作日到账</li>
                <li>直营员工薪资由平台统一发放</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">接单规则</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>上线后可接收广播订单推送（60秒倒计时）</li>
                <li>也可在任务大厅主动选择订单</li>
                <li>接单后需在约定时间内到达服务地点</li>
                <li>频繁取消订单将影响接单优先级</li>
              </ul>
            </div>
          </CardContent>
        </Card>

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

        {/* 在线申诉 */}
        <Card>
          <CardHeader>
            <CardTitle>在线申诉</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">申诉类型</label>
              <Select value={appealType} onValueChange={setAppealType}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择申诉类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="订单争议">订单争议</SelectItem>
                  <SelectItem value="收入问题">收入问题</SelectItem>
                  <SelectItem value="技术故障">技术故障</SelectItem>
                  <SelectItem value="账号问题">账号问题</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">申诉内容</label>
              <Textarea
                placeholder="请详细描述您遇到的问题..."
                value={appealContent}
                onChange={(e) => setAppealContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <Button 
              onClick={handleSubmitAppeal}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "提交中..." : "提交申诉"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              提交后可在"申诉进度"页面查看处理状态
            </p>
          </CardContent>
        </Card>

        {/* 平台客服 */}
        <Card>
          <CardHeader>
            <CardTitle>平台客服</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">客服热线</p>
                <p className="text-2xl font-bold text-primary">400-8888-888</p>
                <p className="text-xs text-muted-foreground mt-1">工作时间：9:00-21:00</p>
              </div>
              <Button size="icon" onClick={handleCall}>
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 联系站长 */}
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
                src={ownerQr}
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
