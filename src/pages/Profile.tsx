import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SkillBadge } from "@/components/ui/skill-badge";
import { useNavigate } from "react-router-dom";
import { User, Star, GraduationCap, Settings, ChevronRight, HelpCircle, FileText, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { useMockAuth } from "@/hooks/useMockAuth";
import { DemoOrder } from "@/hooks/useDemoOrders";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { state: mockState } = useMockAuth();
  const [stats, setStats] = useState({
    monthlyIncome: 0,
    rating: 4.9,
    monthlyServices: 0
  });
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [userName, setUserName] = useState("服务者");
  const [employeeId, setEmployeeId] = useState("TDD001234");
  const [skillLevel, setSkillLevel] = useState<string>("junior");
  const [badgeType, setBadgeType] = useState<string | null>(null);

  // 从 Supabase 和 localStorage 加载真实数据
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 优先从 Supabase profiles 读取认证信息
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, employee_id, avatar_url, skill_level, badge_type')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            if (profile.full_name) setUserName(profile.full_name);
            if (profile.employee_id) setEmployeeId(profile.employee_id);
            else setEmployeeId(`TDD${user.id.slice(-6).toUpperCase()}`);
            if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
            setSkillLevel(profile.skill_level || "junior");
            setBadgeType(profile.badge_type);
          }
        }
        
        // fallback 到 localStorage（仅用于姓名和头像）
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile && !userName) {
          const localProfile = JSON.parse(savedProfile);
          if (localProfile.name && userName === "服务者") setUserName(localProfile.name);
          if (localProfile.avatarUrl && !avatarUrl) setAvatarUrl(localProfile.avatarUrl);
        }

        // 加载订单数据并计算统计
        const completedOrdersStr = localStorage.getItem("completedOrders");
        if (completedOrdersStr) {
          const completedOrders: DemoOrder[] = JSON.parse(completedOrdersStr).map((order: any) => ({
            ...order,
            createdAt: new Date(order.createdAt)
          }));

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          // 计算本月订单
          const monthlyOrders = completedOrders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === currentMonth && 
                   orderDate.getFullYear() === currentYear;
          });

          // 计算本月收入
          const monthlyIncome = monthlyOrders.reduce((sum, order) => sum + order.payout, 0);
          
          // 计算服务次数
          const monthlyServices = monthlyOrders.length;

          setStats({
            monthlyIncome,
            rating: 4.9, // 评分暂时固定
            monthlyServices
          });
        }
      } catch (error) {
        console.error("加载数据失败:", error);
      }
    };
    
    loadUserData();
  }, []);

  const menuItems = [
    { icon: User, label: "个人信息", path: "/profile/details" },
    { icon: FileText, label: "电子合同", path: "/profile/agreements" },
    { icon: Star, label: "我的评价", path: "/reviews" },
    { icon: GraduationCap, label: "技能培训", path: "/skills-training" },
    { icon: HelpCircle, label: "联系与帮助", path: "/help" },
    { icon: Settings, label: "系统设置", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 个人信息区 - 可点击进入编辑 */}
        <div 
          className="bg-gradient-card rounded-xl p-6 shadow-card cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/profile/details")}
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">{userName}</h2>
                <SkillBadge skillLevel={skillLevel} badgeType={badgeType} />
              </div>
              <p className="text-sm text-muted-foreground">工号: {employeeId}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* 快速数据 - 从真实数据源计算 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 text-center shadow-card">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">¥{stats.monthlyIncome}</div>
            <div className="text-xs text-muted-foreground">本月收入</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center shadow-card">
            <div className="text-lg font-bold text-foreground">{stats.rating} ⭐</div>
            <div className="text-xs text-muted-foreground">服务评分</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center shadow-card">
            <div className="text-lg font-bold text-foreground">{stats.monthlyServices}</div>
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
