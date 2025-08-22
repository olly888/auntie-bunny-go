import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Smartphone, Monitor, MapPin, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Device {
  id: string;
  name: string;
  type: "mobile" | "desktop";
  location: string;
  lastActive: string;
  current: boolean;
}

interface LoginRecord {
  id: string;
  time: string;
  location: string;
  device: string;
  ip: string;
  success: boolean;
}

const Security = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [devices] = useState<Device[]>([
    {
      id: "1",
      name: "iPhone 13",
      type: "mobile",
      location: "北京市朝阳区",
      lastActive: "刚刚活跃",
      current: true
    },
    {
      id: "2", 
      name: "Chrome on Windows",
      type: "desktop",
      location: "北京市朝阳区",
      lastActive: "2小时前",
      current: false
    }
  ]);

  const [loginHistory] = useState<LoginRecord[]>([
    {
      id: "1",
      time: "2024-01-20 14:30",
      location: "北京市朝阳区",
      device: "iPhone 13",
      ip: "192.168.1.100",
      success: true
    },
    {
      id: "2",
      time: "2024-01-19 09:15",
      location: "北京市朝阳区", 
      device: "Chrome on Windows",
      ip: "192.168.1.101",
      success: true
    },
    {
      id: "3",
      time: "2024-01-18 22:45",
      location: "上海市浦东新区",
      device: "Unknown Device",
      ip: "123.456.789.012",
      success: false
    }
  ]);

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "密码不匹配",
        description: "新密码与确认密码不一致",
      });
      return;
    }
    
    toast({
      title: "密码已更新",
      description: "您的密码已成功更新",
    });
    
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleTwoFactorToggle = (enabled: boolean) => {
    if (enabled) {
      // Show OTP verification
      setTwoFactorEnabled(true);
      toast({
        title: "二步验证已启用",
        description: "您的账户安全性已提升",
      });
    } else {
      // Require confirmation to disable
      setTwoFactorEnabled(false);
      toast({
        title: "二步验证已关闭",
        description: "建议您重新启用以确保账户安全",
      });
    }
  };

  const handleDeviceLogout = (deviceId: string) => {
    toast({
      title: "设备已下线",
      description: "该设备已被强制下线",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card shadow-card p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">安全设置</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              修改密码
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>当前密码</Label>
              <div className="relative">
                <Input
                  type={showOldPassword ? "text" : "password"}
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  placeholder="请输入当前密码"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label>新密码</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  placeholder="请输入新密码"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                密码长度至少8位，包含字母和数字
              </p>
            </div>
            
            <div>
              <Label>确认新密码</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  placeholder="请再次输入新密码"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button onClick={handlePasswordChange} className="w-full">
              更新密码
            </Button>
          </CardContent>
        </Card>

        {/* Two Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              二步验证
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">短信验证码</p>
                <p className="text-xs text-muted-foreground">
                  登录时需要输入短信验证码
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Switch checked={twoFactorEnabled} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {twoFactorEnabled ? "关闭二步验证" : "启用二步验证"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {twoFactorEnabled 
                        ? "关闭二步验证会降低账户安全性，确定要关闭吗？"
                        : "启用二步验证将提高账户安全性，请输入验证码确认"
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  {!twoFactorEnabled && (
                    <div className="flex justify-center py-4">
                      <InputOTP
                        maxLength={6}
                        value={otpValue}
                        onChange={setOtpValue}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  )}
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleTwoFactorToggle(!twoFactorEnabled)}>
                      {twoFactorEnabled ? "确定关闭" : "确定启用"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Device Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              设备管理
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {devices.map((device, index) => (
              <div key={device.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground">
                      {device.type === "mobile" ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2">
                        {device.name}
                        {device.current && <Badge variant="default" className="text-xs">当前设备</Badge>}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {device.location}
                        <Clock className="h-3 w-3 ml-2" />
                        {device.lastActive}
                      </div>
                    </div>
                  </div>
                  {!device.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeviceLogout(device.id)}
                    >
                      下线
                    </Button>
                  )}
                </div>
                {index < devices.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Login History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              登录历史
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loginHistory.map((record, index) => (
              <div key={record.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${record.success ? 'text-success' : 'text-destructive'}`}>
                      {record.success ? <Shield className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {record.success ? "登录成功" : "登录失败"}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>{record.time}</p>
                        <p>{record.device}</p>
                        <p>{record.location} • {record.ip}</p>
                      </div>
                    </div>
                  </div>
                  {!record.success && (
                    <Badge variant="destructive" className="text-2xs">
                      异常
                    </Badge>
                  )}
                </div>
                {index < loginHistory.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security;