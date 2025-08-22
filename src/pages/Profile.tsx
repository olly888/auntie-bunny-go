import { useOnlineStatus } from "@/hooks/use-online-status";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useNavigate } from "react-router-dom";
import { User, CreditCard, Settings, Bell, Shield, HelpCircle } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { isOnline, setIsOnline } = useOnlineStatus();

  const menuItems = [
    { icon: User, label: "个人资料", path: "/profile/details" },
    { icon: CreditCard, label: "收入明细", path: "/income" },
    { icon: Settings, label: "系统设置", path: "/settings" },
    { icon: HelpCircle, label: "帮助中心", path: "/help" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 个人信息区 */}
        <div className="bg-gradient-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">李阿姨</h2>
              <p className="text-sm text-muted-foreground">服务员工号：TDD001234</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">在线状态</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {isOnline ? "在线接单" : "已下线"}
              </span>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
          </div>
        </div>

        {/* 快速数据 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 text-center shadow-card">
            <div className="text-lg font-bold text-foreground">4.9</div>
            <div className="text-xs text-muted-foreground">服务评分</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center shadow-card">
            <div className="text-lg font-bold text-foreground">328</div>
            <div className="text-xs text-muted-foreground">累计服务</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center shadow-card">
            <div className="text-lg font-bold text-foreground">98%</div>
            <div className="text-xs text-muted-foreground">好评率</div>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="bg-card rounded-xl shadow-card">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </button>
                {index < menuItems.length - 1 && (
                  <div className="h-px bg-border mx-4" />
                )}
              </div>
            );
          })}
        </div>
        
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Profile;