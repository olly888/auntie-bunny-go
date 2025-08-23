import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Link } from "react-router-dom";
import { Rabbit, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import rabbitMascot from "@/assets/rabbit-mascot.png";
import ownerWechatQR from "@/assets/owner-wechat-qr.png";

const Auth = () => {
  const { state, loginWithWeChat, sendOtp, loginWithPhone, setLastLoginMethod } = useMockAuth();
  const [activeTab, setActiveTab] = useState<'wechat' | 'phone'>('wechat');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);

  // 初始化时读取上次登录方式
  useEffect(() => {
    const lastMethod = state.lastLoginMethod || 'wechat';
    setActiveTab(lastMethod);
  }, [state.lastLoginMethod]);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 处理微信登录
  const handleWeChatLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithWeChat();
      setLastLoginMethod('wechat');
    } catch (error) {
      setShowCustomerService(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 发送验证码
  const handleSendOtp = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      toast({
        title: "手机号格式错误",
        description: "请输入正确的11位手机号",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await sendOtp(phone);
      if (result.success) {
        setCountdown(result.countdown);
      } else {
        setShowCustomerService(true);
      }
    } catch (error) {
      setShowCustomerService(true);
    }
  };

  // 手机登录
  const handlePhoneLogin = async () => {
    if (!phone || !code) {
      toast({
        title: "请填写完整信息",
        description: "请输入手机号和验证码",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithPhone({ phone, code });
      if (result.success) {
        setLastLoginMethod('phone');
      } else {
        toast({
          title: "登录失败",
          description: result.error || "登录失败，请重试",
          variant: "destructive",
        });
        if (result.error?.includes('未授权')) {
          setShowCustomerService(true);
        }
      }
    } catch (error) {
      setShowCustomerService(true);
    } finally {
      setIsLoading(false);
    }
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
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value as 'wechat' | 'phone');
              setLastLoginMethod(value as 'wechat' | 'phone');
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wechat">一键登录</TabsTrigger>
              <TabsTrigger value="phone">手机验证码登录</TabsTrigger>
            </TabsList>

            {/* 微信一键登录 */}
            <TabsContent value="wechat" className="space-y-4 mt-6">
              <Button
                onClick={handleWeChatLogin}
                disabled={isLoading}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                {isLoading ? "登录中..." : "微信一键登录"}
              </Button>
            </TabsContent>

            {/* 手机验证码登录 */}
            <TabsContent value="phone" className="space-y-4 mt-6">
              <div className="space-y-4">
                <Input
                  type="tel"
                  placeholder="请输入手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={11}
                />
                
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="请输入验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                  />
                  <Button
                    variant="outline"
                    onClick={handleSendOtp}
                    disabled={countdown > 0 || !phone}
                    className="whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s` : "获取验证码"}
                  </Button>
                </div>

                <Button
                  onClick={handlePhoneLogin}
                  disabled={isLoading || !phone || !code}
                  className="w-full h-12"
                >
                  {isLoading ? "登录中..." : "登录"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  未授权账号无法登录，请联系运营经理开通
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 底部协议区 */}
      <div className="px-6 pb-8 space-y-4">
        <p className="text-xs text-muted-foreground text-center">
          登录即表示您已同意
          <Link to="/legal/service-agreement" className="text-primary hover:underline">
            《用户协议》
          </Link>
          与
          <Link to="/legal/privacy-policy" className="text-primary hover:underline">
            《隐私政策》
          </Link>
        </p>
        <p className="text-xs text-muted-foreground text-center">
          深圳十五分钟网络科技有限公司 提供技术支持
        </p>
      </div>

      {/* 客服二维码弹窗 */}
      <Dialog open={showCustomerService} onOpenChange={setShowCustomerService}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              联系客服
            </DialogTitle>
            <DialogDescription>
              登录遇到问题可添加客服微信
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <img 
              src={ownerWechatQR} 
              alt="客服微信二维码" 
              className="w-48 h-48 object-contain"
            />
          </div>
          <div className="text-center">
            <Button onClick={() => setShowCustomerService(false)}>
              知道了
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;