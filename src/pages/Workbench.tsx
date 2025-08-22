import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { DataCard } from "@/components/ui/data-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useNavigate } from "react-router-dom";
import rabbitMascot from "@/assets/rabbit-mascot.png";

const Workbench = () => {
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();

  // 模拟数据
  const todayStats = {
    completed: 5,
    earnings: 123.5,
    rating: 100
  };

  const currentTask = {
    type: "洗碗兔",
    timeLeft: 15,
    address: "深圳市南山区xx小区 A栋 1201"
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 状态切换按钮 */}
        <StatusIndicator
          status={isOnline ? (currentTask ? "busy" : "online") : "offline"}
          text={isOnline ? (currentTask ? "🔴 服务中，暂不接单" : "🟢 上线接单中") : "🟡 已下线"}
        />

        {/* 今日业绩看板 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">今日业绩</h2>
          <div className="grid grid-cols-3 gap-4">
            <DataCard title="已完成" value={todayStats.completed} unit="单" />
            <DataCard title="预估提成" value={`¥${todayStats.earnings}`} />
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
                  <Button variant="outline" size="sm">
                    查看详情
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-card rounded-xl p-8 text-center shadow-card">
              <img 
                src={rabbitMascot} 
                alt="兔到到吉祥物" 
                className="w-20 h-20 mx-auto mb-4 opacity-80"
              />
              <p className="text-muted-foreground">
                暂无服务，请保持在线，随时准备接单哦！
              </p>
            </div>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="space-y-3">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full"
            onClick={() => setIsOnline(!isOnline)}
          >
            {isOnline ? "下线休息" : "上线接单"}
          </Button>
          
          {!currentTask && (
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => navigate("/income")}
          >
            查看我的收入
          </Button>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Workbench;