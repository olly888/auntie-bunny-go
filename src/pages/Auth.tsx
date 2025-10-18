import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import brandLogo from "@/assets/brand_logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // SECURITY: Only check localStorage auth in development mode
    if (import.meta.env.DEV) {
      const mockUser = localStorage.getItem("mock_user");
      const mockProfile = localStorage.getItem("mock_user_profile");
      
      if (mockUser && mockProfile) {
        navigate("/workbench", { replace: true });
      }
    }
  }, [navigate]);

  const handleOneClickLogin = async () => {
    if (!agreedToTerms) {
      toast({
        title: "请先同意协议",
        description: "请阅读并同意《服务协议》和《隐私政策》",
        variant: "destructive",
      });
      return;
    }

    // SECURITY: Mock auth only in development
    if (!import.meta.env.DEV) {
      toast({
        title: "功能不可用",
        description: "请使用真实的登录方式",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // 模拟获取手机号
    const mockPhone = "138****8888";
    setPhoneNumber(mockPhone);

    setTimeout(() => {
      setLoading(false);
      
      // 检查是否已有用户
      const existingUser = localStorage.getItem("mock_user");
      const existingProfile = localStorage.getItem("mock_user_profile");

      if (existingUser && existingProfile) {
        // 老用户：直接登录
        toast({
          title: "欢迎回来！",
          description: "正在进入工作台...",
        });
        setTimeout(() => navigate("/workbench"), 1000);
      } else {
        // 新用户：弹窗确认
        setShowConfirmDialog(true);
      }
    }, 1000);
  };

  const confirmRegister = () => {
    setShowConfirmDialog(false);
    
    // SECURITY: Only allow in development mode
    if (!import.meta.env.DEV) {
      toast({
        title: "功能不可用",
        description: "请使用真实的注册方式",
        variant: "destructive",
      });
      return;
    }
    
    // 创建基础用户账户
    const newUser = {
      id: `user_${Date.now()}`,
      phone: phoneNumber,
      created_at: new Date().toISOString(),
    };
    
    localStorage.setItem("mock_user", JSON.stringify(newUser));
    
    toast({
      title: "开始注册",
      description: "请选择您的服务意向区域",
    });
    
    setTimeout(() => navigate("/register/location"), 1000);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Logo - 直接与背景融合 */}
        <img 
          src={brandLogo} 
          alt="兔到到" 
          className="h-28 w-auto mb-6 animate-in fade-in zoom-in duration-500"
        />

        {/* 产品定位徽章 */}
        <div className="inline-flex items-center px-6 py-2.5 bg-primary/10 rounded-full mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <span className="text-lg font-medium text-primary">兔管家端</span>
        </div>

        {/* 价值主张 */}
        <h2 className="text-3xl font-semibold text-foreground mb-3 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          自由接单 随时赚钱
        </h2>
        <p className="text-base text-muted-foreground mb-16 text-center max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          灵活工作 收入丰厚<br />月入过万不是梦
        </p>

        {/* 主要操作按钮 */}
        <Button
          className="w-full max-w-sm h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl rounded-2xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400"
          onClick={handleOneClickLogin}
          disabled={loading || !agreedToTerms}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
              登录中...
            </span>
          ) : (
            "本机号码一键登录"
          )}
        </Button>

        {/* 协议勾选 */}
        <div className="flex items-start gap-2 max-w-sm animate-in fade-in duration-500 delay-500">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-0.5"
          />
          <Label
            htmlFor="terms"
            className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
          >
            已阅读并同意{" "}
            <Link to="/legal/service-agreement" className="text-primary hover:underline">
              《服务协议》
            </Link>{" "}
            和{" "}
            <Link to="/legal/privacy-policy" className="text-primary hover:underline">
              《隐私政策》
            </Link>
          </Label>
        </div>

        {/* 页脚 */}
        <div className="mt-16 text-center text-sm text-muted-foreground animate-in fade-in duration-500 delay-600">
          <p>技术支持：兔到到科技</p>
        </div>
      </div>

      {/* Confirmation Dialog for New Users */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">
              🎉 恭喜您！开启自由赚钱之旅
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4 pt-2">
              <p className="text-base">
                手机号 <span className="font-semibold text-primary">{phoneNumber}</span> 即将成为您的财富钥匙
              </p>
              
              {/* 亮点列表 */}
              <div className="space-y-3 text-left bg-accent/30 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="font-semibold text-foreground">灵活赚钱</p>
                    <p className="text-sm">自由接单，时间自己掌控，月入过万不是梦</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-semibold text-foreground">订单丰富</p>
                    <p className="text-sm">社区就近派单，订单源源不断</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="font-semibold text-foreground">平台保障</p>
                    <p className="text-sm">收入及时结算，服务有保险兜底</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                现在加入，即可解锁专属新手福利 🎁
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <AlertDialogAction 
              onClick={confirmRegister}
              className="w-full h-12 text-base font-bold"
            >
              立即开启赚钱之旅 →
            </AlertDialogAction>
            <AlertDialogCancel className="w-full">暂不注册</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Auth;
