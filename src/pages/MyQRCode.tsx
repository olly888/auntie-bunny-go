
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Users, UserCheck, Gift, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import rabbitMascot from "@/assets/rabbit-mascot.png";
import ownerWechatQr from "@/assets/owner-wechat-qr.png";

const MyQRCode = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userReferrals, setUserReferrals] = useState<any>({});
  const [workerReferrals, setWorkerReferrals] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadReferrals();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadReferrals = async () => {
    try {
      setLoading(true);
      
      // 获取用户邀请码
      const { data: userRef, error: userError } = await supabase
        .rpc('ensure_referral', { invite_type: 'user' });
      
      if (userError) throw userError;
      setUserReferrals(userRef);

      // 获取服务员邀请码
      const { data: workerRef, error: workerError } = await supabase
        .rpc('ensure_referral', { invite_type: 'worker' });
      
      if (workerError) throw workerError;
      setWorkerReferrals(workerRef);

    } catch (error) {
      console.error('Error loading referrals:', error);
      toast({
        title: "加载失败",
        description: "获取邀请信息失败，请重试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const shareInviteLink = (type: 'user' | 'worker') => {
    const referral = type === 'user' ? userReferrals : workerReferrals;
    const inviteUrl = `${window.location.origin}/r/${referral.ref_code}`;
    
    if (navigator.share) {
      navigator.share({
        title: type === 'user' ? '邀请使用兔到到' : '邀请加入兔到到团队',
        text: type === 'user' 
          ? '快来试试兔到到的便民服务吧！' 
          : '加入兔到到，成为优秀的服务提供者！',
        url: inviteUrl
      });
    } else {
      navigator.clipboard.writeText(inviteUrl);
      toast({
        title: "已复制",
        description: "邀请链接已复制到剪贴板"
      });
    }
  };

  const generateQRCode = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-semibold">我的二维码</h1>
          <div className="w-16"></div>
        </div>

        <div className="p-4 space-y-6">

          {/* 企业微信二维码推荐 */}
          <Card className="p-6 bg-gradient-card border-2 border-primary/20">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <img src={rabbitMascot} alt="兔到到" className="w-8 h-8" />
                <span className="font-semibold text-lg">推荐企业微信</span>
              </div>
              
              <div className="bg-white p-4 rounded-lg inline-block">
                <img 
                  src={profile?.wecom_qr_url || ownerWechatQr} 
                  alt="企业微信二维码" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  扫码添加企业微信，获得更好的服务体验
                </p>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <QrCode className="w-3 h-3 mr-1" />
                  官方推荐
                </Badge>
              </div>
            </div>
          </Card>

          {/* 邀请码标签页 */}
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                邀请用户
              </TabsTrigger>
              <TabsTrigger value="worker" className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                招募服务员
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-4 mt-6">
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">邀请用户使用兔到到</h3>
                  <p className="text-sm text-muted-foreground">
                    邀请朋友使用兔到到服务，双方都能获得优惠券
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-primary/30">
                    <img 
                      src={generateQRCode(`${window.location.origin}/r/${userReferrals.ref_code}`)}
                      alt="用户邀请二维码" 
                      className="w-40 h-40 mx-auto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">邀请码</p>
                    <Badge variant="outline" className="font-mono text-sm px-3 py-1">
                      {userReferrals.ref_code}
                    </Badge>
                  </div>

                  <Button 
                    onClick={() => shareInviteLink('user')}
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    分享邀请链接
                  </Button>
                </div>
              </Card>

              {/* 邀请奖励说明 */}
              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-amber-800">邀请奖励</h4>
                    <p className="text-xs text-amber-700">
                      好友注册并首次下单，您和好友各得10元优惠券
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="worker" className="space-y-4 mt-6">
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">招募优秀服务员</h3>
                  <p className="text-sm text-muted-foreground">
                    邀请朋友加入兔到到团队，共同提供优质服务
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-primary/30">
                    <img 
                      src={generateQRCode(`${window.location.origin}/r/${workerReferrals.ref_code}`)}
                      alt="服务员邀请二维码" 
                      className="w-40 h-40 mx-auto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">邀请码</p>
                    <Badge variant="outline" className="font-mono text-sm px-3 py-1">
                      {workerReferrals.ref_code}
                    </Badge>
                  </div>

                  <Button 
                    onClick={() => shareInviteLink('worker')}
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    分享邀请链接
                  </Button>
                </div>
              </Card>

              {/* 招募奖励说明 */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-blue-800">招募奖励</h4>
                    <p className="text-xs text-blue-700">
                      成功邀请服务员并通过审核，可获得50元现金奖励
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default MyQRCode;
