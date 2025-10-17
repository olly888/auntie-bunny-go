import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Wallet, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";

interface InvitationStats {
  totalInvites: number;
  totalReward: number;
  pendingReward: number;
  successfulInvites: number;
}

interface InvitationRecord {
  id: string;
  inviteeName: string;
  registeredAt: string;
  status: "pending" | "completed" | "rewarded";
  rewardAmount: number;
}

const InvitationRewards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [refCode, setRefCode] = useState("");
  const [stats, setStats] = useState<InvitationStats>({
    totalInvites: 0,
    totalReward: 0,
    pendingReward: 0,
    successfulInvites: 0,
  });
  const [records, setRecords] = useState<InvitationRecord[]>([]);

  useEffect(() => {
    loadInvitationData();
  }, []);

  const loadInvitationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "请先登录",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // 获取或创建邀请码
      const { data: referral, error: refError } = await supabase
        .rpc('ensure_referral', { invite_type: 'worker' });

      if (refError) throw refError;

      const code = referral.ref_code;
      setRefCode(code);

      // 生成二维码
      const inviteUrl = `${window.location.origin}/auth?ref=${code}&type=worker`;
      const qrDataUrl = await QRCode.toDataURL(inviteUrl, {
        width: 300,
        margin: 2,
      });
      setQrCodeUrl(qrDataUrl);

      // 这里应该从数据库加载真实数据
      // 暂时使用演示数据
      setStats({
        totalInvites: 2,
        totalReward: 100,
        pendingReward: 50,
        successfulInvites: 1,
      });

      setRecords([
        {
          id: "1",
          inviteeName: "张阿姨",
          registeredAt: "2024-01-15",
          status: "rewarded",
          rewardAmount: 100,
        },
        {
          id: "2",
          inviteeName: "李阿姨",
          registeredAt: "2024-01-20",
          status: "pending",
          rewardAmount: 50,
        },
      ]);
    } catch (error) {
      console.error("加载邀请数据失败:", error);
      toast({
        title: "加载失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const inviteText = `我在兔到到赚钱，你也来！邀请码：${refCode}\n立即扫码加入，完成培训即可开始接单赚钱！\n${window.location.origin}/auth?ref=${refCode}&type=worker`;
    
    if (navigator.share) {
      navigator.share({
        title: "邀请你加入兔到到",
        text: inviteText,
      });
    } else {
      navigator.clipboard.writeText(inviteText);
      toast({
        title: "复制成功",
        description: "邀请文案已复制到剪贴板",
      });
    }
  };

  const getStatusBadge = (status: InvitationRecord["status"]) => {
    const statusMap = {
      pending: { label: "待完成", variant: "secondary" as const },
      completed: { label: "待结算", variant: "default" as const },
      rewarded: { label: "已发放", variant: "outline" as const },
    };
    const { label, variant } = statusMap[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">邀请奖励</h1>
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-card rounded-xl animate-pulse"></div>
            <div className="h-32 bg-card rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border sticky top-0 bg-background z-10">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">邀请服务伙伴，双方都赚钱</h1>
        </div>

        <div className="p-4 space-y-4">
          {/* 顶部高亮卡片 */}
          <Card className="bg-gradient-to-br from-pink-500 to-purple-600 text-white border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="text-2xl font-bold mb-2">邀请服务伙伴，双方都赚钱！</h2>
              <p className="text-white/90 text-sm mb-4">
                成功邀请注册：<span className="font-bold text-xl">¥100现金</span>
              </p>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
                <span className="text-sm">被邀请人可获得新手福利包</span>
              </div>
            </CardContent>
          </Card>

          {/* 可视化邀请流程 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Share2 className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">分享链接</span>
                </div>
                <div className="text-muted-foreground">→</div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">好友注册</span>
                </div>
                <div className="text-muted-foreground">→</div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">获得奖励</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 显著的分享按钮 */}
          <Button 
            size="lg" 
            className="w-full h-14 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 mr-2" />
            立即分享给微信好友
          </Button>

          {/* 二维码展示 */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">好友扫码立即注册</p>
                {qrCodeUrl && (
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <img src={qrCodeUrl} alt="邀请二维码" className="w-48 h-48" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">邀请码：{refCode}</p>
              </div>
            </CardContent>
          </Card>

          {/* 标签式统计展示 */}
          <Tabs defaultValue="rewards" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rewards">我的奖励</TabsTrigger>
              <TabsTrigger value="records">邀请记录</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rewards" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {stats.totalInvites}
                      </div>
                      <div className="text-sm text-muted-foreground">累计邀请</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        ¥{stats.totalReward}
                      </div>
                      <div className="text-sm text-muted-foreground">累计奖励</div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">待结算奖励</span>
                      <span className="text-lg font-semibold text-amber-600">¥{stats.pendingReward}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => navigate("/wallet")}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    前往我的钱包
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="records" className="mt-4 space-y-3">
              {records.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">暂无邀请记录</p>
                  </CardContent>
                </Card>
              ) : (
                records.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{record.inviteeName}</span>
                            {getStatusBadge(record.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            注册时间：{record.registeredAt}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            ¥{record.rewardAmount}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* 可折叠的规则说明 */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="rules">
              <AccordionTrigger className="text-base">
                📋 活动规则详情
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">奖励标准：</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 好友注册成功：奖励 ¥20</li>
                    <li>• 好友完成首单：奖励 ¥30</li>
                    <li>• 好友完成10单：奖励 ¥50</li>
                    <li className="font-medium text-foreground">总计最高可获得：¥100/人</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">结算说明：</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 奖励将在满足条件后3个工作日内发放</li>
                    <li>• 奖励直接到账至"我的钱包"</li>
                    <li>• 可随时申请提现到银行卡</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">注意事项：</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 邀请人数无上限，多邀多得</li>
                    <li>• 被邀请人必须是新注册用户</li>
                    <li>• 平台保留活动最终解释权</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default InvitationRewards;
