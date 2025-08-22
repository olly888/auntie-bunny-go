import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DataCard } from "@/components/ui/data-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import rabbitMascot from "@/assets/rabbit-mascot.png";

const Workbench = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [hasCurrentTask, setHasCurrentTask] = useState(false);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const navigate = useNavigate();

  const handleToggleOnline = (checked: boolean) => {
    if (checked) {
      setIsOnline(true);
    } else {
      if (hasCurrentTask) {
        setShowOfflineDialog(true);
      } else {
        setIsOnline(false);
      }
    }
  };

  const confirmGoOffline = () => {
    setIsOnline(false);
    setHasCurrentTask(false);
    setShowOfflineDialog(false);
  };

  // 模拟数据
  const todayStats = {
    completed: 5,
    earnings: 123.5,
    rating: 100
  };

  const currentTask = hasCurrentTask ? {
    type: "洗碗兔",
    timeLeft: 15,
    address: "深圳市南山区xx小区 A栋 1201"
  } : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 顶部问候卡片 */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold mb-1">早上好，小兔！</h1>
              <p className="text-sm text-primary-foreground/80">
                今天又是充满活力的一天 🌟
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
              onClick={() => window.location.href = "tel:400-123-4567"}
            >
              <Phone className="w-4 h-4 mr-1" />
              紧急求助
            </Button>
          </div>
        </Card>

        {/* 上线/下线开关控制 */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="font-medium text-foreground">
                {isOnline ? "上线接单" : "下线休息"}
              </span>
            </div>
            <AlertDialog open={showOfflineDialog} onOpenChange={setShowOfflineDialog}>
              <Switch
                checked={isOnline}
                onCheckedChange={handleToggleOnline}
                className="data-[state=checked]:bg-green-500"
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认下线</AlertDialogTitle>
                  <AlertDialogDescription>
                    {hasCurrentTask 
                      ? "您当前有进行中的任务，下线将自动完成当前任务。确定要下线吗？"
                      : "确定要下线休息吗？下线后将无法接收新订单。"
                    }
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowOfflineDialog(false)}>
                    取消
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={confirmGoOffline}>
                    确认下线
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>

        {/* 今日核心数据 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">今日数据</h2>
          <div className="grid grid-cols-3 gap-4">
            <DataCard title="已完成" value={todayStats.completed} unit="单" />
            <DataCard title="今日收入" value={`¥${todayStats.earnings}`} />
            <DataCard title="好评率" value={todayStats.rating} unit="%" />
          </div>
        </div>


        {/* 当前任务区域 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">当前任务</h2>
          
          {currentTask ? (
            <div className="bg-gradient-card border-2 border-primary rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="text-2xl">🐰</div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground mb-1">
                    {currentTask.type} | 剩余约 {currentTask.timeLeft} 分钟
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    📍 {currentTask.address}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate("/order-service")}>
                    查看详情
                  </Button>
                </div>
              </div>
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
        </div>

        {/* 演示按钮：模拟接到任务 */}
        {isOnline && !currentTask && (
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => setHasCurrentTask(true)}
          >
            模拟接到任务
          </Button>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Workbench;