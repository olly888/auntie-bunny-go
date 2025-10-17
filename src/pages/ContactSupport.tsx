import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Phone, MessageSquare, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import ownerWechatQr from "@/assets/owner-wechat-qr.png";

const ContactSupport = () => {
  const navigate = useNavigate();
  const [appealType, setAppealType] = useState("");
  const [appealContent, setAppealContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platformPhone = "400-123-4567"; // 平台客服电话

  const handleCall = () => {
    window.open(`tel:${platformPhone}`, '_self');
  };

  const handleSubmitAppeal = async () => {
    if (!appealType || !appealContent.trim()) {
      toast({
        title: "请填写完整信息",
        description: "请选择申诉类型并填写申诉内容",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const storedUser = localStorage.getItem("mock_user");
      if (!storedUser) {
        toast({
          title: "未登录",
          description: "请先登录",
          variant: "destructive"
        });
        return;
      }

      const user = JSON.parse(storedUser);
      
      // 生成工单号
      const ticketNumber = `AP${Date.now().toString().slice(-8)}`;
      
      // TODO: 实际项目中应该保存到Supabase
      // await supabase.from('appeal_tickets').insert(appeal);
      
      toast({
        title: "申诉已提交",
        description: `工单编号：${ticketNumber}\n我们将在24小时内回复您`,
        action: (
          <Button 
            size="sm" 
            onClick={() => navigate(`/appeal-progress/${ticketNumber}`)}
          >
            查看进度
          </Button>
        ),
        duration: 5000
      });
      
      // 重置表单
      setAppealType("");
      setAppealContent("");
      
    } catch (error) {
      toast({
        title: "提交失败",
        description: "请稍后重试或直接联系客服",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">联系平台/申诉</h1>
          <div className="w-9" />
        </div>

        <div className="p-4 space-y-6">
          {/* 在线申诉表单 */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-foreground">
                <MessageSquare className="w-5 h-5" />
                在线申诉
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appealType" className="text-foreground">申诉类型</Label>
                <Select value={appealType} onValueChange={setAppealType}>
                  <SelectTrigger id="appealType">
                    <SelectValue placeholder="请选择申诉类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">订单纠纷</SelectItem>
                    <SelectItem value="income">收入问题</SelectItem>
                    <SelectItem value="account">账号问题</SelectItem>
                    <SelectItem value="other">其他问题</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appealContent" className="text-foreground">申诉内容</Label>
                <Textarea
                  id="appealContent"
                  placeholder="请详细描述您遇到的问题..."
                  value={appealContent}
                  onChange={(e) => setAppealContent(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {appealContent.length}/500
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-400">
                  提交申诉后，我们将在24小时内处理并通过短信或站内消息通知您
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleSubmitAppeal}
                disabled={isSubmitting}
              >
                {isSubmitting ? "提交中..." : "提交申诉"}
              </Button>
            </CardContent>
          </Card>

          {/* 联系站长 */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-foreground">
                <MessageSquare className="w-5 h-5" />
                联系站长
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-4 bg-accent/30 rounded-lg">
                <img 
                  src={ownerWechatQr}
                  alt="站长企业微信二维码" 
                  className="w-32 h-32 mb-3"
                />
                <p className="text-sm font-medium text-foreground">扫码联系站长</p>
                <p className="text-xs text-muted-foreground">企业微信</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
