
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, Mail, HelpCircle, Clock, AlertCircle } from "lucide-react";

const Help = () => {
  const navigate = useNavigate();

  const faqData = [
    {
      id: "payment",
      question: "如何查看我的收入明细？",
      answer: "您可以在个人页面点击"收入明细"查看每日、每月的详细收入记录，包括服务费、奖励和提成等。"
    },
    {
      id: "schedule",
      question: "如何调整我的工作时间？",
      answer: "在工作台页面，您可以通过上线/下线开关控制接单状态。在个人设置中也可以设置您的偏好工作时间段。"
    },
    {
      id: "order",
      question: "接到订单后如何操作？",
      answer: "接单后请按照订单详情中的地址准时到达，完成服务后在APP中确认完成，用户确认后您将收到相应的服务费用。"
    },
    {
      id: "rating",
      question: "如何提高我的服务评分？",
      answer: "保持良好的服务态度、准时到达、认真完成每项服务、与用户积极沟通，都有助于提高您的服务评分。"
    },
    {
      id: "insurance",
      question: "工作期间是否有保险保障？",
      answer: "兔到到为所有在线服务员工提供工作期间的意外伤害保险，具体保障内容可在"我的保险"中查看。"
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "客服热线",
      description: "400-888-0000",
      subtitle: "7×24小时服务",
      action: () => window.location.href = "tel:400-888-0000"
    },
    {
      icon: MessageCircle,
      title: "在线客服",
      description: "微信客服",
      subtitle: "快速响应",
      action: () => {
        // 这里可以跳转到微信客服或内置聊天
        alert("正在连接在线客服...");
      }
    },
    {
      icon: Mail,
      title: "邮件反馈",
      description: "help@tudaodao.com",
      subtitle: "24小时内回复",
      action: () => window.location.href = "mailto:help@tudaodao.com"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        
        {/* 顶部导航 */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <h1 className="text-lg font-semibold">帮助中心</h1>
          <div className="w-16"></div>
        </div>

        <div className="p-4 space-y-6">

          {/* 紧急求助 */}
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">紧急求助</h3>
                <p className="text-sm text-red-700">遇到紧急情况请立即联系</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
                onClick={() => window.location.href = "tel:400-888-0000"}
              >
                <Phone className="w-4 h-4 mr-1" />
                拨打
              </Button>
            </div>
          </Card>

          {/* 常见问题 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">常见问题</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* 联系我们 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">联系我们</h2>
            <div className="space-y-3">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={index} className="p-4">
                    <button
                      onClick={method.action}
                      className="w-full flex items-center gap-4 text-left hover:bg-accent/50 transition-colors rounded-lg p-2 -m-2"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{method.title}</h3>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <p className="text-xs text-muted-foreground">{method.subtitle}</p>
                      </div>
                      <span className="text-muted-foreground">›</span>
                    </button>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 服务时间 */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-800">客服服务时间</h3>
                <p className="text-sm text-blue-700">周一至周日 08:00-22:00</p>
                <p className="text-xs text-blue-600 mt-1">紧急情况24小时热线服务</p>
              </div>
            </div>
          </Card>

        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Help;
