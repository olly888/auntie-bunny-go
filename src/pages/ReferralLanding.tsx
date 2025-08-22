
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Briefcase, Gift, ArrowRight } from "lucide-react";
import rabbitMascot from "@/assets/rabbit-mascot.png";

const ReferralLanding = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [referral, setReferral] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (code) {
      loadReferral(code);
    }
  }, [code]);

  const loadReferral = async (refCode: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          profiles:inviter_id (
            full_name,
            store_id,
            stores:store_id (
              name
            )
          )
        `)
        .eq('ref_code', refCode)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('邀请码不存在或已失效');
        } else {
          throw error;
        }
        return;
      }

      setReferral(data);
      
      // 记录扫码事件
      await supabase
        .from('referral_events')
        .insert({
          referral_id: data.id,
          event_type: 'scan',
          user_agent: navigator.userAgent,
          extra: {
            timestamp: new Date().toISOString(),
            referrer: document.referrer
          }
        });

    } catch (error) {
      console.error('Error loading referral:', error);
      setError('加载邀请信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = () => {
    // 这里可以跳转到注册页面，并携带邀请码参数
    // 暂时跳转到首页
    navigate('/?ref=' + code);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !referral) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold mb-2">邀请无效</h2>
          <p className="text-muted-foreground mb-6">{error || '此邀请链接不存在或已过期'}</p>
          <Button onClick={() => navigate('/')} className="w-full">
            返回首页
          </Button>
        </Card>
      </div>
    );
  }

  const isUserInvite = referral.invite_type === 'user';
  const inviterName = referral.profiles?.full_name || '兔阿姨';
  const storeName = referral.profiles?.stores?.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="max-w-md mx-auto p-4 space-y-6 pt-12">
        
        {/* 欢迎卡片 */}
        <Card className="p-8 text-center bg-gradient-card border-2 border-primary/20 shadow-lg">
          <div className="flex justify-center mb-6">
            <img src={rabbitMascot} alt="兔到到" className="w-20 h-20" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isUserInvite ? '欢迎来到兔到到！' : '加入兔到到团队！'}
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {inviterName} 邀请您{isUserInvite ? '体验便民服务' : '成为服务提供者'}
            {storeName && <span className="block text-sm mt-1">来自：{storeName}</span>}
          </p>

          <div className="flex items-center justify-center gap-2 mb-6">
            {isUserInvite ? (
              <UserPlus className="w-5 h-5 text-primary" />
            ) : (
              <Briefcase className="w-5 h-5 text-primary" />
            )}
            <Badge variant="outline" className="font-mono">
              {referral.ref_code}
            </Badge>
          </div>

          <Button onClick={handleJoin} size="lg" className="w-full">
            {isUserInvite ? '立即体验' : '申请加入'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        {/* 权益说明 */}
        <Card className="p-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3 mb-4">
            <Gift className="w-6 h-6 text-amber-600" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                {isUserInvite ? '新用户专享' : '加入福利'}
              </h3>
              {isUserInvite ? (
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• 注册即送10元优惠券</li>
                  <li>• 首单再享8.8折优惠</li>
                  <li>• 邀请人也将获得奖励</li>
                </ul>
              ) : (
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• 灵活工作时间安排</li>
                  <li>• 完善的培训体系</li>
                  <li>• 丰厚的服务收入</li>
                  <li>• 推荐奖金等你拿</li>
                </ul>
              )}
            </div>
          </div>
        </Card>

        {/* 关于兔到到 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">关于兔到到</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            兔到到是一家专业的便民服务平台，提供洗碗、家政、维修等多样化服务。
            我们致力于为用户提供高品质、便捷的生活服务，为服务提供者创造灵活的工作机会。
          </p>
        </Card>

        {/* 底部链接 */}
        <div className="text-center text-xs text-muted-foreground">
          <p>点击"立即体验"即表示您同意</p>
          <div className="flex justify-center gap-4 mt-1">
            <button 
              onClick={() => navigate('/legal/service-agreement')}
              className="underline hover:text-primary"
            >
              服务协议
            </button>
            <button 
              onClick={() => navigate('/legal/privacy-policy')}
              className="underline hover:text-primary"
            >
              隐私政策
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReferralLanding;
