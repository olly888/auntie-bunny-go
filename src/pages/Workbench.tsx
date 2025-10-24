import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { RefreshCw, Plus } from "lucide-react";
import { GrabModal, OrderInfo } from "@/components/order/GrabModal";
import { OrderCard, OnboardingTask } from "@/components/order/OrderCard";
import { OfflineReasonDialog } from "@/components/order/OfflineReasonDialog";
import { useDemoOrders } from "@/hooks/useDemoOrders";
import { toast } from "@/hooks/use-toast";
import rabbitMascot from "@/assets/rabbit-mascot.png";

// 获取新手任务列表
const getOnboardingTasks = (profile: any): OnboardingTask[] => {
  if (profile?.onboarding_status === 'activated') {
    return [];
  }
  
  let stepNumber = 1;
  const tasks: OnboardingTask[] = [];
  
  // 实名认证任务
  if (!profile?.is_id_verified) {
    tasks.push({
      id: 'onboarding-id-verify',
      type: '📋 实名认证',
      duration: '5分钟',
      address: '完成身份验证',
      distance: '',
      payout: '0',
      isOnboardingTask: true,
      completed: false,
      route: '/certification/intro',
      description: '扫描身份证 + 人脸识别',
      benefit: '解锁接单能力',
      reward: '获得5元奖励',
      stepNumber: stepNumber++,
    });
  }
  
  // 培训任务
  if (!profile?.is_training_completed) {
    tasks.push({
      id: 'onboarding-training',
      type: '📖 新人培训',
      duration: '10分钟',
      address: '学习服务规范',
      distance: '',
      payout: '0',
      isOnboardingTask: true,
      completed: false,
      route: '/skills-training/course/0',
      description: '掌握服务技巧，提升接单成功率',
      benefit: '提升接单成功率',
      reward: '优先推送订单',
      stepNumber: stepNumber++,
    });
  }
  
  // 签署协议任务
  if (!profile?.agreement_signed_at) {
    tasks.push({
      id: 'onboarding-agreement',
      type: '📝 签署协议',
      duration: '3分钟',
      address: '保障双方权益',
      distance: '',
      payout: '0',
      isOnboardingTask: true,
      completed: false,
      route: '/profile/agreements',
      description: '阅读并同意服务协议',
      benefit: '获得平台保障',
      reward: '正式开启接单',
      stepNumber: stepNumber++,
    });
  }
  
  return tasks;
};

const Workbench = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("hall");
  const [showGrabModal, setShowGrabModal] = useState(false);
  const [broadcastOrder, setBroadcastOrder] = useState<OrderInfo | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // 从 localStorage 加载 profile 并监听变化
  useEffect(() => {
    const loadProfile = () => {
      const storedProfile = localStorage.getItem("mock_user_profile");
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        
        // 检查是否完成所有新手任务并自动激活
        if (parsedProfile.is_id_verified && parsedProfile.is_training_completed && parsedProfile.agreement_signed_at) {
          if (parsedProfile.onboarding_status !== 'activated') {
            parsedProfile.onboarding_status = 'activated';
            localStorage.setItem("mock_user_profile", JSON.stringify(parsedProfile));
            
            toast({
              title: "🎊 恭喜解锁接单权限！",
              description: "您已获得全部赚钱能力！现在就去抢单，开启收入增长之旅 💰",
              duration: 6000
            });
          }
        }
      }
    };
    
    loadProfile();
    
    window.addEventListener('storage', loadProfile);
    return () => window.removeEventListener('storage', loadProfile);
  }, [toast]);

  // 刷新 profile
  const refreshProfile = () => {
    const storedProfile = localStorage.getItem("mock_user_profile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  };

  // 轮播文案数组
  const rotatingMessages = [
    "今天又是充满活力的一天 🌟",
    "🐰小兔已就绪，准备开启服务的一天～",
    "☀️ 每一次上门，都是一次温柔的专业传递",
    "🏠 轻松赚钱，照顾家庭两不误",
    "✨ 阿姨不是家政，是社区专业家务搭子",
    "🎀 服务开始前，形象与礼仪也准备好了",
    "💖 你不是一个人在等待，是兔到到和你一起"
  ];
  const location = useLocation();
  
  const { 
    pendingOrders, 
    completedOrders, 
    currentOrder, 
    todayStats, 
    createOrder, 
    claimOrder, 
    completeOrder 
  } = useDemoOrders();

  // Set active tab from navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      const validTabs = ["hall", "inprogress", "done"];
      if (validTabs.includes(location.state.activeTab)) {
        setActiveTab(location.state.activeTab);
      }
    }
  }, [location.state]);

  // 文案轮播效果
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => 
        (prev + 1) % rotatingMessages.length
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [rotatingMessages.length]);

  const handleToggleOnline = (checked: boolean) => {
    // 检查是否已激活
    if (checked && profile?.onboarding_status !== 'activated') {
      toast({
        title: "账户尚未激活",
        description: "请先完成所有新手任务",
        action: (
          <Button 
            size="sm" 
            onClick={() => {
              document.getElementById('onboarding-tasks')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
          >
            立即前往
          </Button>
        )
      });
      return;
    }

    if (checked) {
      setIsOnline(true);
      toast({
        title: "已上线",
        description: "现在可以接单了！"
      });
    } else {
      setShowOfflineDialog(true);
    }
  };

  const confirmGoOffline = async (reason: string) => {
    setIsOnline(false);
    setShowOfflineDialog(false);
    // 不显示toast，开关状态变化本身就是反馈
  };

  // 模拟广播弹窗
  const simulateBroadcast = () => {
    if (!isOnline) {
      toast({
        title: "请先上线",
        description: "需要先上线才能接收订单推送",
        variant: "destructive"
      });
      return;
    }

    const newOrder = createOrder();
    const orderInfo: OrderInfo = {
      id: newOrder.id,
      type: newOrder.type,
      duration: newOrder.duration,
      address: newOrder.address,
      distance: newOrder.distance,
      payout: newOrder.payout
    };
    
    setBroadcastOrder(orderInfo);
    setShowGrabModal(true);
    
    toast({
      title: "新订单推送！",
      description: "60秒倒计时开始，请及时抢单",
    });
  };

  // 处理抢单
  const handleGrabOrder = () => {
    if (broadcastOrder) {
      claimOrder(broadcastOrder.id);
      setShowGrabModal(false);
      setBroadcastOrder(null);
      setActiveTab("inprogress");
      
      toast({
        title: "抢单成功！",
        description: `已成功抢到${broadcastOrder.type}订单`,
      });
    }
  };

  // 处理超时（订单流入任务大厅）
  const handleTimeout = () => {
    setShowGrabModal(false);
    setBroadcastOrder(null);
    setActiveTab("hall");
    
    toast({
      title: "订单已流入任务大厅",
      description: "您可以到任务大厅主动选择订单",
    });
  };

  // 从任务大厅抢单
  const handleClaimFromHall = (orderId: string) => {
    if (!isOnline) {
      toast({
        title: "请先上线",
        description: "需要先打开上线接单开关才能抢单",
        variant: "destructive"
      });
      return;
    }

    // 检查账户激活状态
    if (profile?.onboarding_status !== 'activated') {
      toast({
        title: "🔒 账户尚未激活",
        description: "请先完成所有新手任务才能抢单",
        action: (
          <Button 
            size="sm" 
            onClick={() => {
              document.getElementById('onboarding-tasks')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
          >
            立即完成
          </Button>
        ),
        duration: 6000
      });
      return;
    }

    if (currentOrder) {
      toast({
        title: "当前已有任务",
        description: "请先完成当前任务再抢新订单",
        variant: "destructive"
      });
      return;
    }

    const claimedOrder = claimOrder(orderId);
    if (claimedOrder) {
      setActiveTab("inprogress");
      toast({
        title: "抢单成功！",
        description: `已成功抢到${claimedOrder.type}订单`,
      });
    }
  };

  // 刷新当前页面内容
  const handleRefresh = () => {
    // 不显示toast，直接刷新数据
    // 实际应用中这里应该重新请求数据
  };

  // 完成当前订单
  const handleCompleteOrder = () => {
    if (currentOrder) {
      completeOrder();
      setActiveTab("done");
      toast({
        title: "订单已完成！",
        description: `恭喜您完成${currentOrder.type}订单，获得¥${currentOrder.payout}提成`,
      });
    }
  };

  // 计算工作时长（简化计算）
  const workHours = Math.floor(todayStats.completed * 0.75);
  
  // 获取新手任务列表
  const onboardingTasks = getOnboardingTasks(profile);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 顶部问候卡片 */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground">
          <div>
            <h1 className="text-lg font-semibold mb-1">早上好，小兔！</h1>
            <p className="text-sm text-primary-foreground/80">
              {rotatingMessages[currentMessageIndex]}
            </p>
          </div>
        </Card>

        {/* 上线/下线开关控制 */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div>
                <span className="font-medium text-foreground">
                  {isOnline ? "上线接单" : "下线休息"}
                </span>
                {profile?.onboarding_status !== 'activated' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    完成新手任务后解锁
                  </p>
                )}
              </div>
            </div>
            <Switch
              checked={isOnline}
              onCheckedChange={handleToggleOnline}
              disabled={profile?.onboarding_status !== 'activated'}
              className={`data-[state=checked]:bg-green-500 ${profile?.onboarding_status !== 'activated' ? 'opacity-50' : ''}`}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            今日：{todayStats.completed} 单 · ¥{todayStats.earnings} · {workHours} 小时
          </div>
        </Card>

        {/* TAB栏 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-2">
            <TabsList className="grid flex-1 grid-cols-3">
              <TabsTrigger value="hall" className="relative pr-6">
                任务大厅
                {pendingOrders.length > 0 && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center translate-x-1/3 -translate-y-1/3">
                    {pendingOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="inprogress" className="relative pr-6">
                进行中
                {currentOrder && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center translate-x-1/3 -translate-y-1/3">
                    1
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="done" className="relative pr-6">
                已完成
                {completedOrders.length > 0 && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center translate-x-1/3 -translate-y-1/3">
                    {completedOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleRefresh}
              title="刷新"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <TabsContent value="hall" className="mt-4">
            {onboardingTasks.length > 0 || pendingOrders.length > 0 ? (
              <div className="space-y-3">
                {/* 精简版新手引导卡片 */}
                {onboardingTasks.length > 0 && (
                  <Card className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                    <div className="space-y-2.5">
                      {/* 核心信息 */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔥</span>
                        <p className="text-xs text-foreground/90">
                          <span className="font-semibold text-primary">今日128人</span>已完成任务开单
                          <span className="text-muted-foreground ml-1">• 平均18分钟</span>
                        </p>
                      </div>
                      
                      {/* 进度条 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">新手任务进度</span>
                          <span className="text-muted-foreground">{3 - onboardingTasks.length}/3</span>
                        </div>
                        <div className="w-full bg-muted/50 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${((3 - onboardingTasks.length) / 3) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* 提示文案 */}
                      <p className="text-xs text-muted-foreground">
                        完成下方任务，解锁接单权限
                      </p>
                    </div>
                  </Card>
                )}
                
                {/* 新手任务置顶显示 */}
                {onboardingTasks.map((task) => (
                  <OrderCard
                    key={task.id}
                    order={task}
                    variant="compact"
                  />
                ))}
                {/* 待抢订单 */}
                {pendingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClaim={handleClaimFromHall}
                    variant="compact"
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
                  <p className="font-medium text-foreground">等待新订单中...</p>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? "保持在线状态，随时准备接单" : "请先上线后等待订单"}
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inprogress" className="mt-4">
            {currentOrder ? (
              <div className="bg-gradient-card border-2 border-success rounded-xl p-6 shadow-card relative">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl">{currentOrder.type.split(' ')[0]}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">
                        {currentOrder.type}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        📍 {currentOrder.address} ({currentOrder.distance})
                      </div>
                      <div className="text-sm font-medium text-success">
                        预计提成：¥{currentOrder.payout}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                      服务中
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/service/${currentOrder.id}`)}
                    className="px-6"
                  >
                    查看详情
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="p-8 text-center border-2 border-dashed border-muted-foreground/30">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">暂无进行中的任务</p>
                    <p className="text-sm text-muted-foreground">
                      请到任务大厅接单开始工作
                    </p>
                  </div>
                  {isOnline && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={simulateBroadcast}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      模拟广播弹窗
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="done" className="mt-4">
            {completedOrders.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground mb-3">
                  今日已完成 {todayStats.completed} 单，共获得 ¥{todayStats.earnings} 提成
                </div>
                {completedOrders.slice(0, 5).map((order) => (
                  <Card key={order.id} className="p-4 bg-gradient-card">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-card-foreground mb-1">
                          {order.type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.address} | {order.duration}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.createdAt.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-success">
                        +¥{order.payout}
                      </div>
                    </div>
                  </Card>
                ))}
                {completedOrders.length > 5 && (
                  <div className="text-center text-sm text-muted-foreground">
                    显示最近 5 条记录，共 {completedOrders.length} 条
                  </div>
                )}
              </div>
            ) : (
              <Card className="p-8 text-center border-2 border-dashed border-muted-foreground/30">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">暂无已完成订单</p>
                  <p className="text-sm text-muted-foreground">
                    完成任务后将在这里显示历史记录
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* 抢单弹窗 */}
      {broadcastOrder && (
        <GrabModal
          orderInfo={broadcastOrder}
          isVisible={showGrabModal}
          onGrab={handleGrabOrder}
          onTimeout={handleTimeout}
        />
      )}
      
      {/* 下线原因弹窗 */}
      <OfflineReasonDialog
        open={showOfflineDialog}
        onOpenChange={setShowOfflineDialog}
        onConfirm={confirmGoOffline}
      />
      
      <BottomNav />
    </div>
  );
};

export default Workbench;
