import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Rabbit, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import rabbitMascot from "@/assets/rabbit-mascot.png";
import ownerWechatQR from "@/assets/owner-wechat-qr.png";

const Auth = () => {
  const navigate = useNavigate();
  const { signInWithPassword, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);

  // 检查现有会话
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, onboarding_status')
          .eq('id', user.id)
          .maybeSingle();
        
        if (!profile) {
          navigate('/register');
        } else {
          navigate('/workbench');
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "请填写完整信息",
        description: "请输入邮箱和密码",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { data, error } = await signInWithPassword(email, password);
    if (!error && data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();
      
      navigate(profile ? '/workbench' : '/register');
    } else {
      toast({
        title: "登录失败",
        description: error?.message || "请检查邮箱和密码",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleSignup = async () => {
    if (!email || !password) {
      toast({
        title: "请填写完整信息",
        description: "请输入邮箱和密码",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "密码过短",
        description: "密码至少需要6个字符",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password);
    if (!error) {
      toast({
        title: "注册成功！",
        description: "请前往快速注册页完善信息",
      });
      navigate('/register');
    } else {
      toast({
        title: "注册失败",
        description: error.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
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

          {/* 登录/注册切换 */}
          <Tabs 
            value={mode} 
            onValueChange={(value) => setMode(value as 'login' | 'signup')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="signup">注册</TabsTrigger>
            </TabsList>

            {/* 登录 */}
            <TabsContent value="login" className="space-y-4 mt-6">
              <Input
                type="email"
                placeholder="请输入邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-12"
              >
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </TabsContent>

            {/* 注册 */}
            <TabsContent value="signup" className="space-y-4 mt-6">
              <Input
                type="email"
                placeholder="请输入邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="设置密码（至少6位）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full h-12"
              >
                {isLoading ? "注册中..." : "注册"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                注册后需完善个人信息才能开始接单
              </p>
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