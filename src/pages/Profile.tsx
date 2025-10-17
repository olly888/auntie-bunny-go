import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useNavigate } from "react-router-dom";
import { User, Star, GraduationCap, Settings, ChevronRight, MessageCircle, HelpCircle, FileText } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "个人信息", description: "管理头像、姓名、证件等个人资料", path: "/profile/details" },
    { icon: FileText, label: "电子合同", description: "查看已签署的协议", path: "/profile/agreements" },
    { icon: Star, label: "我的评价", description: "查看用户给出的所有历史评价", path: "/reviews" },
    { icon: GraduationCap, label: "技能培训", description: "课程学习、技能认证、测试考核", path: "/skills-training" },
    { icon: HelpCircle, label: "帮助中心", description: "查看平台规则和常见问题解答", path: "/help" },
    { icon: MessageCircle, label: "联系平台/申诉", description: "提供平台客服电话或申诉表单入口", path: "/contact" },
    { icon: Settings, label: "系统设置", description: "退出登录等", path: "/settings" },
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
              <p className="text-sm text-muted-foreground">所属门店：兔到到·大冲华润城店</p>
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
                  <div className="text-left">
                    <div className="text-base text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
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
