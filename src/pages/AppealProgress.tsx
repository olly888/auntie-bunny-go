import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AppealTicket {
  id: string;
  ticket_number: string;
  appeal_type: string;
  content: string;
  status: 'pending' | 'processing' | 'completed';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  result?: string;
  notes?: string;
}

const AppealProgress = () => {
  const navigate = useNavigate();
  const { ticketNumber } = useParams<{ ticketNumber: string }>();
  const [ticket, setTicket] = useState<AppealTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTicket();
  }, [ticketNumber]);

  const loadTicket = async () => {
    try {
      const { data, error } = await supabase
        .from('appeal_tickets')
        .select('*')
        .eq('ticket_number', ticketNumber)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error("未找到该申诉工单");
        return;
      }

      setTicket(data as AppealTicket);
    } catch (error) {
      console.error('Error loading ticket:', error);
      toast.error("加载申诉信息失败");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '待处理', color: 'bg-yellow-500', icon: Clock };
      case 'processing':
        return { text: '处理中', color: 'bg-blue-500', icon: Clock };
      case 'completed':
        return { text: '已完成', color: 'bg-green-500', icon: CheckCircle };
      default:
        return { text: '未知', color: 'bg-gray-500', icon: XCircle };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <Button variant="ghost" onClick={() => navigate('/contact')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <Card className="p-8 text-center mt-4">
            <p className="text-muted-foreground">未找到申诉记录</p>
          </Card>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(ticket.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/contact')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">申诉进度</h1>
            <p className="text-sm text-muted-foreground">工单号：{ticket.ticket_number}</p>
          </div>
        </div>

        {/* Status Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full ${statusInfo.color} flex items-center justify-center`}>
              <StatusIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{statusInfo.text}</h2>
              <p className="text-sm text-muted-foreground">
                {ticket.status === 'pending' && '我们已收到您的申诉，将在24小时内处理'}
                {ticket.status === 'processing' && '客服正在处理您的申诉'}
                {ticket.status === 'completed' && '您的申诉已处理完成'}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 mt-6">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="w-0.5 h-8 bg-green-500" />
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium">已提交</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(ticket.created_at).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${ticket.status !== 'pending' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                {ticket.status === 'completed' && <div className="w-0.5 h-8 bg-blue-500" />}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium">处理中</p>
                <p className="text-sm text-muted-foreground">
                  {ticket.status !== 'pending' ? '客服正在处理您的申诉' : '预计24小时内开始处理'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${ticket.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium">已完成</p>
                {ticket.completed_at ? (
                  <p className="text-sm text-muted-foreground">
                    {new Date(ticket.completed_at).toLocaleString('zh-CN')}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">待处理完成</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Appeal Details */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">申诉详情</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">申诉类型</p>
              <Badge variant="outline">{ticket.appeal_type}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">申诉内容</p>
              <p className="text-sm">{ticket.content}</p>
            </div>
            {ticket.result && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">处理结果</p>
                <p className="text-sm">{ticket.result}</p>
              </div>
            )}
            {ticket.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">备注</p>
                <p className="text-sm text-muted-foreground">{ticket.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Contact Support */}
        <Card className="p-4 bg-accent/5">
          <p className="text-sm text-muted-foreground mb-2">
            如需进一步咨询，请联系客服
          </p>
          <p className="text-sm font-medium">客服电话：400-123-4567</p>
        </Card>
      </div>
    </div>
  );
};

export default AppealProgress;