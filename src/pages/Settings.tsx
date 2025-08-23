import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bell, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: {
      newOrders: true,
      systemMessages: true,
      trainingReminders: false
    }
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("user-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("user-settings", JSON.stringify(settings));
  }, [settings]);

  const updateNestedSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [key]: value
      }
    }));
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
          <h1 className="text-lg font-semibold">系统设置</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Notification Settings */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">新订单通知</p>
                <p className="text-xs text-muted-foreground">
                  收到新订单时推送通知
                </p>
              </div>
              <Switch
                checked={settings.notifications.newOrders}
                onCheckedChange={(checked) => updateNestedSetting("notifications", "newOrders", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">系统消息</p>
                <p className="text-xs text-muted-foreground">
                  接收系统更新和维护通知
                </p>
              </div>
              <Switch
                checked={settings.notifications.systemMessages}
                onCheckedChange={(checked) => updateNestedSetting("notifications", "systemMessages", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">培训提醒</p>
                <p className="text-xs text-muted-foreground">
                  培训课程和考试提醒
                </p>
              </div>
              <Switch
                checked={settings.notifications.trainingReminders}
                onCheckedChange={(checked) => updateNestedSetting("notifications", "trainingReminders", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Legal and Terms */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate("/legal/service-agreement")}
            >
              服务协议
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate("/legal/privacy-policy")}
            >
              隐私政策
            </Button>
          </CardContent>
        </Card>

        {/* Log Out */}
        <Card>
          <CardContent className="pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  退出账号
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认退出登录</AlertDialogTitle>
                  <AlertDialogDescription>
                    退出后需要重新登录才能使用应用功能。确认退出吗？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    localStorage.clear();
                    navigate('/');
                    toast({
                      title: "已退出登录",
                      description: "感谢使用，期待您的再次登录",
                    });
                  }}>
                    确认退出
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;