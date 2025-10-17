import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";
import { Rabbit } from "lucide-react";
import ownerWechatQr from "@/assets/owner-wechat-qr.png";
import rabbitMascot from "@/assets/rabbit-mascot.png";
import { useMockAuth } from "@/hooks/useMockAuth";

export default function Auth() {
  const navigate = useNavigate();
  const { loginWithWeChat, sendOtp, loginWithPhone } = useMockAuth();
  const [mode, setMode] = useState<'wechat' | 'phone'>('wechat');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  // 检查是否已登录
  useEffect(() => {
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      const profile = localStorage.getItem("mock_user_profile");
      if (profile) {
        navigate('/workbench');
      } else {
        navigate('/register');
      }
    }
  }, [navigate]);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 微信一键登录
  const handleWeChatLogin = async () => {
    setLoading(true);
    try {
      await loginWithWeChat();
      // 检查是否有profile
      const profile = localStorage.getItem("mock_user_profile");
      if (profile) {
        navigate('/workbench');
      } else {
        navigate('/register');
      }
    } catch (error) {
      console.error('WeChat login failed:', error);
    }
    setLoading(false);
  };

  // 发送验证码
  const handleSendOtp = async () => {
    if (!phone || phone.length !== 11) {
      toast({
        title: "手机号格式错误",
        description: "请输入11位手机号",
        variant: "destructive",
      });
      return;
    }

    const result = await sendOtp(phone);
    if (result.success) {
      setCountdown(result.countdown);
    }
  };

  // 手机验证码登录
  const handlePhoneLogin = async () => {
    if (!phone || !code) {
      toast({
        title: "请填写完整",
        description: "请输入手机号和验证码",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const result = await loginWithPhone({ phone, code });
    
    if (result.success) {
      // 检查是否有profile
      const profile = localStorage.getItem("mock_user_profile");
      if (profile) {
        navigate('/workbench');
      } else {
        navigate('/register');
      }
    } else {
      toast({
        title: "登录失败",
        description: result.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 顶部品牌区 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo和品牌区 */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Rabbit className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                兔到到
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg text-foreground">欢迎回来，兔阿姨～</span>
              <span className="text-lg">🐰</span>
            </div>
            <div className="flex justify-center">
              <img 
                src={rabbitMascot} 
                alt="兔阿姨" 
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>

          {/* 登录方式切换 */}
          <Card>
            <CardHeader>
              <CardTitle>登录 / 注册</CardTitle>
              <CardDescription>
                兔到到 - 您身边的专业社区服务平台
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'wechat' | 'phone')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wechat">微信登录</TabsTrigger>
                  <TabsTrigger value="phone">手机登录</TabsTrigger>
                </TabsList>
                
                <TabsContent value="wechat" className="space-y-4 py-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      使用微信授权快速登录
                    </p>
                    <Button 
                      className="w-full h-12 text-base bg-[#07C160] hover:bg-[#06AD56] text-white"
                      onClick={handleWeChatLogin}
                      disabled={loading}
                    >
                      {loading ? "登录中..." : "🔑 微信一键登录"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      首次登录将自动注册账号
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="phone" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">手机号</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="请输入11位手机号"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={11}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">验证码</Label>
                    <div className="flex gap-2">
                      <Input
                        id="code"
                        type="text"
                        placeholder="请输入验证码"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendOtp}
                        disabled={countdown > 0 || !phone}
                        className="whitespace-nowrap"
                      >
                        {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      演示环境验证码：123456
                    </p>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handlePhoneLogin}
                    disabled={loading || !phone || !code}
                  >
                    {loading ? "登录中..." : "登录"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    首次登录将自动注册账号
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 底部协议区 */}
      <div className="px-6 pb-8 space-y-4">
        <p className="text-xs text-muted-foreground text-center">
          登录即表示您已同意
          <span className="text-primary"> 《用户协议》</span>
          与
          <span className="text-primary"> 《隐私政策》</span>
        </p>
        <p className="text-xs text-muted-foreground text-center">
          深圳十五分钟网络科技有限公司 提供技术支持
        </p>
      </div>
    </div>
  );
}
