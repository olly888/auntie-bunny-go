import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Phone, Rabbit } from "lucide-react";
import { useMockAuth } from "@/hooks/useMockAuth";

export default function Auth() {
  const navigate = useNavigate();
  const { loginWithWeChat, sendOtp, loginWithPhone } = useMockAuth();
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    if (!agreedToTerms) {
      toast({
        title: "请先同意协议",
        description: "请勾选同意《服务协议》与《隐私政策》",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      await loginWithWeChat();
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
    if (!agreedToTerms) {
      toast({
        title: "请先同意协议",
        description: "请勾选同意《服务协议》与《隐私政策》",
        variant: "destructive",
      });
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex flex-col">
      {/* 顶部品牌区 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        {/* Logo 区域 - 更大更突出 */}
        <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6">
          <Rabbit className="w-14 h-14 text-primary" />
        </div>
        
        {/* 品牌名称 */}
        <h1 className="text-4xl font-bold text-foreground mb-2">
          兔到到
        </h1>
        
        {/* 身份标识 */}
        <div className="inline-flex items-center px-4 py-1.5 bg-primary/10 rounded-full mb-4">
          <span className="text-sm font-medium text-primary">兔管家端</span>
        </div>
        
        {/* Slogan - 更有吸引力 */}
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          加入我们，灵活赚高薪
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          让每一份付出都有回报
        </p>
        
        {/* 主登录区域 */}
        <div className="w-full max-w-sm space-y-4">
          {/* 微信一键登录 - 巨大按钮 */}
          <Button 
            className="w-full h-16 text-lg font-semibold bg-[#07C160] hover:bg-[#06AD56] text-white shadow-lg disabled:opacity-50"
            onClick={handleWeChatLogin}
            disabled={loading || !agreedToTerms}
          >
            <span className="mr-3 text-xl">🔑</span>
            微信一键登录/注册
          </Button>
          
          {/* 或 分隔线 */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <button
                onClick={() => setShowPhoneLogin(!showPhoneLogin)}
                className="px-4 py-1 bg-background text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                或 使用手机号登录/注册
              </button>
            </div>
          </div>
          
          {/* 手机号登录表单 - 折叠显示 */}
          {showPhoneLogin && (
            <Card className="border-2 animate-in slide-in-from-top-2">
              <CardContent className="pt-6 space-y-4">
                {/* 手机号输入 */}
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="请输入手机号"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={11}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </div>
                
                {/* 验证码输入 */}
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
                      className="h-12 text-base"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendOtp}
                      disabled={countdown > 0 || !phone}
                      className="h-12 whitespace-nowrap px-6"
                    >
                      {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    演示环境验证码：123456
                  </p>
                </div>
                
                {/* 登录按钮 */}
                <Button 
                  className="w-full h-12 text-base"
                  onClick={handlePhoneLogin}
                  disabled={loading || !phone || !code || !agreedToTerms}
                >
                  {loading ? "登录中..." : "登录/注册"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* 底部协议区 - 更清晰的复选框 */}
      <div className="px-6 pb-8 space-y-4">
        <div className="flex items-start gap-3 justify-center max-w-sm mx-auto">
          <Checkbox 
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-0.5"
          />
          <Label 
            htmlFor="terms" 
            className="text-sm leading-relaxed cursor-pointer"
          >
            我已阅读并同意
            <button 
              className="text-primary font-medium mx-1" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/legal/service-agreement');
              }}
            >
              《服务协议》
            </button>
            与
            <button 
              className="text-primary font-medium mx-1"
              onClick={(e) => {
                e.preventDefault();
                navigate('/legal/privacy-policy');
              }}
            >
              《隐私政策》
            </button>
          </Label>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          深圳十五分钟网络科技有限公司 提供技术支持
        </p>
      </div>
    </div>
  );
}
