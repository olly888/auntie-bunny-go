import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlideToggle } from "@/components/ui/slide-toggle";
import { DataCard } from "@/components/ui/data-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import rabbitMascot from "@/assets/rabbit-mascot.png";

const Workbench = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [hasCurrentTask, setHasCurrentTask] = useState(false);
  const navigate = useNavigate();

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
              {/* 微型业绩条 - 仅在无当前任务时显示 */}
              {!currentTask && (
                <button
                  onClick={() => navigate("/income")}
                  className="mt-3 flex items-center gap-3 text-sm bg-primary-foreground/10 rounded-lg px-3 py-2 hover:bg-primary-foreground/20 transition-colors"
                >
                  <span className="text-primary-foreground/90">
                    今日 {todayStats.completed}单 · ¥{todayStats.earnings} · {todayStats.rating}%
                  </span>
                  <span className="text-xs text-primary-foreground/60">点击查看详情</span>
                </button>
              )}
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

        {/* 滑动上线/下线控制 */}
        <SlideToggle
          isOn={isOnline}
          onToggle={(newState) => {
            setIsOnline(newState);
            if (!newState) setHasCurrentTask(false); // 下线时清除任务
          }}
          onText="上线接单"
          offText="下线休息"
        />


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