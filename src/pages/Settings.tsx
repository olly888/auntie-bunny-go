import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Palette, Globe, Bell, Zap, Trash2, Moon, Sun, Monitor, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    theme: "system", // light, dark, system
    language: "zh-CN",
    notifications: {
      newOrders: true,
      systemMessages: true,
      trainingReminders: false
    },
    interactions: {
      hapticFeedback: true,
      soundAlerts: false,
      reducedAnimation: false
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

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [key]: value
      }
    }));
  };

  const handleThemeChange = (theme: string) => {
    updateSetting("theme", theme);
    
    // Apply theme immediately
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System theme
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    
    toast({
      title: "主题已更新",
      description: "主题设置已保存",
    });
  };

  const handleLanguageChange = (language: string) => {
    updateSetting("language", language);
    toast({
      title: "语言已更新",
      description: "语言设置已保存，部分功能需要重启应用生效",
    });
  };

  const clearCache = () => {
    try {
      // Clear specific app caches
      const keysToKeep = ["user-settings", "user-online-status"];
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keysToKeep.includes(key)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      toast({
        title: "缓存已清理",
        description: "应用缓存已清理完成",
      });
      
      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "清理失败",
        description: "缓存清理过程中出现错误",
      });
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
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
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              外观主题
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">主题模式</p>
                <p className="text-xs text-muted-foreground">
                  选择应用的外观主题
                </p>
              </div>
              <Select value={settings.theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-32">
                  <div className="flex items-center gap-2">
                    {getThemeIcon(settings.theme)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      浅色
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      深色
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      跟随系统
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              语言与地区
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">界面语言</p>
                <p className="text-xs text-muted-foreground">
                  选择应用的显示语言
                </p>
              </div>
              <Select value={settings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-CN">简体中文</SelectItem>
                  <SelectItem value="zh-TW">繁體中文</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              通知偏好
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

        {/* Interaction Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              交互偏好
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">触觉反馈</p>
                <p className="text-xs text-muted-foreground">
                  按键操作时提供震动反馈
                </p>
              </div>
              <Switch
                checked={settings.interactions.hapticFeedback}
                onCheckedChange={(checked) => updateNestedSetting("interactions", "hapticFeedback", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">声音提示</p>
                <p className="text-xs text-muted-foreground">
                  操作时播放提示音
                </p>
              </div>
              <Switch
                checked={settings.interactions.soundAlerts}
                onCheckedChange={(checked) => updateNestedSetting("interactions", "soundAlerts", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">减少动画</p>
                <p className="text-xs text-muted-foreground">
                  减少界面动画效果
                </p>
              </div>
              <Switch
                checked={settings.interactions.reducedAnimation}
                onCheckedChange={(checked) => updateNestedSetting("interactions", "reducedAnimation", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Legal and Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              法律与条款
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              onClick={() => navigate("/legal/privacy")}
            >
              隐私政策
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              数据管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">清理缓存</p>
                <p className="text-xs text-muted-foreground">
                  清除应用缓存数据，不影响个人设置
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    清理
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>清理应用缓存</AlertDialogTitle>
                    <AlertDialogDescription>
                      此操作将清除应用缓存数据，可能会提升应用性能。您的个人设置和登录状态不会受到影响。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={clearCache}>
                      确定清理
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;