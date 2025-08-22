import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, HelpCircle, Phone, MessageCircle, GraduationCap, Send, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [feedbackForm, setFeedbackForm] = useState({
    category: "",
    title: "",
    description: "",
    contact: ""
  });

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

  const handleFeedbackSubmit = () => {
    if (!feedbackForm.category || !feedbackForm.title || !feedbackForm.description) {
      toast({
        variant: "destructive",
        title: "信息不完整",
        description: "请填写完整的反馈信息",
      });
      return;
    }

    toast({
      title: "反馈已提交",
      description: "感谢您的反馈，我们会在3个工作日内回复",
    });

    setFeedbackForm({
      category: "",
      title: "",
      description: "",
      contact: ""
    });
  };

  const handleCallService = () => {
    window.location.href = "tel:400-123-4567";
  };

  const goToTraining = () => {
    navigate("/training");
  };

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
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={goToTraining}
          >
            <GraduationCap className="h-6 w-6" />
            <span className="text-sm">新手指南</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate(-1)}
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm">联系站长</span>
          </Button>
        </div>

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

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              意见反馈
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>反馈类型</Label>
              <Select value={feedbackForm.category} onValueChange={(value) => setFeedbackForm({...feedbackForm, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择反馈类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">功能异常</SelectItem>
                  <SelectItem value="feature">功能建议</SelectItem>
                  <SelectItem value="service">服务问题</SelectItem>
                  <SelectItem value="other">其他问题</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>问题标题</Label>
              <Input
                value={feedbackForm.title}
                onChange={(e) => setFeedbackForm({...feedbackForm, title: e.target.value})}
                placeholder="简要描述您遇到的问题"
              />
            </div>

            <div>
              <Label>详细描述</Label>
              <Textarea
                value={feedbackForm.description}
                onChange={(e) => setFeedbackForm({...feedbackForm, description: e.target.value})}
                placeholder="请详细描述问题的具体情况..."
                rows={4}
              />
            </div>

            <div>
              <Label>联系方式（可选）</Label>
              <Input
                value={feedbackForm.contact}
                onChange={(e) => setFeedbackForm({...feedbackForm, contact: e.target.value})}
                placeholder="方便我们回复您（手机号或邮箱）"
              />
            </div>

            <Button onClick={handleFeedbackSubmit} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              提交反馈
            </Button>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>更多资源</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={goToTraining}>
              <GraduationCap className="h-4 w-4 mr-2" />
              培训课程
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
            
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/legal/service-agreement")}>
              <HelpCircle className="h-4 w-4 mr-2" />
              服务协议
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
            
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/legal/privacy")}>
              <HelpCircle className="h-4 w-4 mr-2" />
              隐私政策
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;