import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, QrCode, Copy, Download, Share2, Users, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";

interface InvitationData {
  userRefCode: string;
  workerRefCode: string;
  userInviteCount: number;
  userReward: number;
  workerInviteCount: number;
  workerReward: number;
}

const Invitations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitationData, setInvitationData] = useState<InvitationData>({
    userRefCode: "",
    workerRefCode: "",
    userInviteCount: 0,
    userReward: 0,
    workerInviteCount: 0,
    workerReward: 0,
  });
  const [userQrCode, setUserQrCode] = useState<string>("");
  const [workerQrCode, setWorkerQrCode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvitationData();
  }, []);

  const loadInvitationData = async () => {
    try {
      // Get or create user referral code
      const { data: userReferral, error: userError } = await supabase
        .rpc('ensure_referral', { invite_type: 'user' });
      
      if (userError) throw userError;

      // Get or create worker referral code
      const { data: workerReferral, error: workerError } = await supabase
        .rpc('ensure_referral', { invite_type: 'worker' });
      
      if (workerError) throw workerError;

      // Generate QR codes
      const userUrl = `https://your-app.com/register?ref=${userReferral.ref_code}&type=user`;
      const workerUrl = `https://your-app.com/register?ref=${workerReferral.ref_code}&type=worker`;
      
      const userQr = await QRCode.toDataURL(userUrl);
      const workerQr = await QRCode.toDataURL(workerUrl);

      setUserQrCode(userQr);
      setWorkerQrCode(workerQr);
      
      setInvitationData({
        userRefCode: userReferral.ref_code,
        workerRefCode: workerReferral.ref_code,
        userInviteCount: 12, // TODO: Get from referral_events
        userReward: 60,     // TODO: Calculate from events
        workerInviteCount: 2, // TODO: Get from referral_events
        workerReward: 100,    // TODO: Calculate from events
      });
    } catch (error) {
      console.error('Error loading invitation data:', error);
      toast({
        title: "加载失败",
        description: "无法加载邀请数据，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "复制成功",
      description: `${label}已复制到剪贴板`,
    });
  };

  const userInviteText = `邻居你好，这是我在用的家务小程序，扫码下单阿姨15分钟上门，还有新人优惠~ https://your-app.com/register?ref=${invitationData.userRefCode}&type=user`;
  
  const workerInviteText = `我现在加入了兔到到，做得不错，推荐你也来，推荐成功还有奖励！ https://your-app.com/register?ref=${invitationData.workerRefCode}&type=worker`;

  const downloadQRCode = (qrCodeDataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = qrCodeDataUrl;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">我的邀请</h1>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-card rounded-xl animate-pulse"></div>
            <div className="h-48 bg-card rounded-xl animate-pulse"></div>
            <div className="h-48 bg-card rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">我的邀请</h1>
        </div>

        {/* Introduction */}
        <Card className="bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-5 h-5 text-primary" />
              <span className="font-medium">我的邀请</span>
            </div>
            <p className="text-sm text-muted-foreground">
              让更多邻居和朋友一起用兔到到，邀请越多奖励越多！
            </p>
          </CardContent>
        </Card>

        {/* User Invitation Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-5 h-5 text-primary" />
              邀请用户
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code */}
            <div className="flex justify-center p-4 bg-background rounded-lg">
              {userQrCode && (
                <img src={userQrCode} alt="用户邀请二维码" className="w-32 h-32" />
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadQRCode(userQrCode, '用户邀请海报.png')}
              >
                <Download className="w-4 h-4 mr-1" />
                邀请海报
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(userInviteText, "邀请话术")}
              >
                <Copy className="w-4 h-4 mr-1" />
                复制话术
              </Button>
            </div>

            {/* Statistics */}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                已邀请用户：<span className="font-medium text-foreground">{invitationData.userInviteCount}人</span>
              </span>
              <Badge variant="secondary">
                累计奖励：¥{invitationData.userReward}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Worker Invitation Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="w-5 h-5 text-primary" />
              邀请阿姨
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code */}
            <div className="flex justify-center p-4 bg-background rounded-lg">
              {workerQrCode && (
                <img src={workerQrCode} alt="阿姨邀请二维码" className="w-32 h-32" />
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadQRCode(workerQrCode, '阿姨招募海报.png')}
              >
                <Download className="w-4 h-4 mr-1" />
                招募海报
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(workerInviteText, "邀请话术")}
              >
                <Copy className="w-4 h-4 mr-1" />
                复制话术
              </Button>
            </div>

            {/* Statistics */}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                已邀请入职：<span className="font-medium text-foreground">{invitationData.workerInviteCount}人</span>
              </span>
              <Badge variant="outline">
                奖励待结算：¥{invitationData.workerReward}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📘 规则说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <div className="font-medium text-foreground mb-1">• 用户拉新</div>
              <p className="text-muted-foreground pl-4">
                每成功拉新1位用户（扫码注册下单），奖励¥5，上不封顶
              </p>
            </div>
            <div className="text-sm">
              <div className="font-medium text-foreground mb-1">• 阿姨邀请</div>
              <p className="text-muted-foreground pl-4">
                每成功邀请1位新阿姨入职并完成服务，奖励¥50~¥100
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Invitations;