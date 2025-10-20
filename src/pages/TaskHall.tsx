import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { OrderCard } from "@/components/order/OrderCard";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemoOrders } from "@/hooks/useDemoOrders";
import { toast } from "@/hooks/use-toast";
import rabbitMascot from "@/assets/rabbit-mascot.png";

const TaskHall = () => {
  const navigate = useNavigate();
  const { pendingOrders, claimOrder, createOrder } = useDemoOrders();
  const [profile, setProfile] = useState<any>(null);

  // 加载用户 profile 并监听变化
  useEffect(() => {
    const loadProfile = () => {
      const storedProfile = localStorage.getItem("mock_user_profile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    };
    
    loadProfile();
    window.addEventListener('storage', loadProfile);
    return () => window.removeEventListener('storage', loadProfile);
  }, []);

  const handleClaimOrder = (orderId: string) => {
    // 检查是否已登录
    const storedProfile = localStorage.getItem("mock_user_profile");
    if (!storedProfile) {
      toast({
        title: "请先登录",
        description: "需要登录后才能抢单",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    const userProfile = JSON.parse(storedProfile);
    
    // 检查是否已激活
    if (userProfile.onboarding_status !== 'activated') {
      // 计算未完成的任务
      const incompleteTasks = [];
      if (!userProfile.is_id_verified) {
        incompleteTasks.push({ name: "实名认证", route: "/certification" });
      }
      if (!userProfile.is_training_completed) {
        incompleteTasks.push({ name: "培训学习", route: "/skills-training" });
      }
      if (!userProfile.agreement_signed_at) {
        incompleteTasks.push({ name: "签署合同", route: "/profile/agreements" });
      }

      // 显示友好提示
      toast({
        title: "🔒 账户尚未激活",
        description: `还需完成 ${incompleteTasks.length} 个新手任务才能抢单`,
        action: (
          <Button 
            size="sm" 
            onClick={() => {
              // 导航到第一个未完成的任务
              navigate(incompleteTasks[0].route);
            }}
          >
            立即前往
          </Button>
        ),
        duration: 6000
      });
      return;
    }

    // 已激活用户，正常抢单逻辑
    const claimedOrder = claimOrder(orderId);
    if (claimedOrder) {
      toast({
        title: "抢单成功！",
        description: `已成功抢到${claimedOrder.type}订单`,
      });
      navigate("/");
    }
  };

  const handleCreateDemoOrder = () => {
    createOrder();
    toast({
      title: "演示订单已创建",
      description: "新的演示订单已添加到任务大厅",
    });
  };

  const handleRefresh = () => {
    // 刷新动画效果
    toast({
      title: "已刷新",
      description: "任务大厅已更新到最新状态",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        
        {/* 页头 */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">任务大厅</h1>
                <div className="text-sm text-muted-foreground">
                  {pendingOrders.length > 0 ? `${pendingOrders.length} 个待抢订单` : '暂无订单'}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          
          {/* 新手任务提示卡片 */}
          {profile && profile.onboarding_status !== 'activated' && (
            <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🎁</div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground mb-2">
                    完成新手任务，解锁抢单权限
                  </h3>
                  <div className="space-y-1.5 mb-3">
                    {!profile.is_id_verified && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">1</span>
                        <span className="text-muted-foreground">实名认证</span>
                      </div>
                    )}
                    {!profile.is_training_completed && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">2</span>
                        <span className="text-muted-foreground">培训学习</span>
                      </div>
                    )}
                    {!profile.agreement_signed_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">3</span>
                        <span className="text-muted-foreground">签署合同</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate("/workbench")}
                  >
                    前往完成
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* 演示功能区 */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-primary">演示功能</div>
              <div className="text-xs text-muted-foreground mb-3">
                点击按钮创建演示订单，体验抢单流程
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={handleCreateDemoOrder}
              >
                创建演示订单
              </Button>
            </div>
          </Card>

          {/* 订单列表 */}
          {pendingOrders.length > 0 ? (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClaim={handleClaimOrder}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center border-2 border-dashed border-primary/30 bg-primary/5">
              <img 
                src={rabbitMascot} 
                alt="兔到到吉祥物" 
                className="w-20 h-20 mx-auto mb-4 opacity-80"
              />
              <div className="space-y-2">
                <p className="font-medium text-foreground">暂无可接订单</p>
                <p className="text-sm text-muted-foreground">
                  保持在线状态，新订单会自动推送给您
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  或者点击上方按钮创建演示订单进行体验
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default TaskHall;