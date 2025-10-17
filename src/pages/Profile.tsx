import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useNavigate } from "react-router-dom";
import { User, Star, GraduationCap, Settings, ChevronRight, MessageCircle, HelpCircle, FileText, Gift } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "个人信息", path: "/profile/details" },
    { icon: FileText, label: "电子合同", path: "/profile/agreements" },
    { icon: Star, label: "我的评价", path: "/reviews" },
    { icon: GraduationCap, label: "技能培训", path: "/skills-training" },
    { icon: HelpCircle, label: "帮助中心", path: "/help" },
    { icon: MessageCircle, label: "联系平台/申诉", path: "/contact" },
    { icon: Settings, label: "系统设置", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 个人信息区 */}
        <div className="bg-gradient-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                李阿姨 <span className="text-sm font-normal text-muted-foreground">(工号: TDD001234)</span>
              </h2>
            </div>
          </div>
        </div>

        {/* 快速数据 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 text-center shadow-card">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">¥2,450</div>
            <div className="text-xs text-muted-foreground">本月收入</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center shadow-card">
            <div className="text-lg font-bold text-foreground">4.9 ⭐</div>
            <div className="text-xs text-muted-foreground">服务评分</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center shadow-card">
            <div className="text-lg font-bold text-foreground">28</div>
            <div className="text-xs text-muted-foreground">本月服务</div>
          </div>
        </div>

        {/* 邀请奖励 */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-4 px-4 rounded-none hover:bg-accent"
            onClick={() => navigate("/invitation-rewards")}
          >
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-primary" />
              <div className="text-base text-foreground">邀请奖励</div>
              <Badge variant="secondary" className="ml-1">赚钱</Badge>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        {/* 功能菜单 */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <div className="space-y-0">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-between h-auto py-4 px-4 rounded-none hover:bg-accent"
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-primary" />
                  <div className="text-base text-foreground">{item.label}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </div>
        
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Profile;
