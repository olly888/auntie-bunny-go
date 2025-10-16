import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, MapPin } from "lucide-react";

export interface OrderInfo {
  id: string;
  type: string;
  duration: string;
  address: string;
  distance: string;
  payout: number;
}

interface GrabModalProps {
  orderInfo: OrderInfo;
  isVisible: boolean;
  onGrab: () => void;
  onTimeout: () => void;
  countdown?: number;
}

export const GrabModal = ({ 
  orderInfo, 
  isVisible, 
  onGrab, 
  onTimeout, 
  countdown: initialCountdown = 60 
}: GrabModalProps) => {
  const [countdown, setCountdown] = useState(initialCountdown);

  // 重置倒计时当模态框变为可见时 + 添加振动和响铃
  useEffect(() => {
    if (isVisible) {
      setCountdown(initialCountdown);
      
      // 持续振动
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
      
      // 播放提示音（持续响铃）
      const audio = new Audio('/notification.mp3');
      audio.loop = true;
      audio.play().catch(err => console.log('Audio play failed:', err));
      
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [isVisible, initialCountdown]);

  // 倒计时逻辑
  useEffect(() => {
    if (isVisible && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isVisible && countdown === 0) {
      onTimeout();
    }
  }, [countdown, isVisible, onTimeout]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl p-8 max-w-sm w-full shadow-card animate-in fade-in-0 zoom-in-95 duration-300">
        
        {/* 响铃图标 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4 animate-bounce">
            <Bell className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">新订单！</h1>
        </div>

        {/* 订单信息 */}
        <div className="bg-gradient-card rounded-xl p-6 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-card-foreground">服务类型：</span>
            <span className="text-lg font-bold text-primary">{orderInfo.type}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold text-card-foreground">预估时长：</span>
            <span className="text-card-foreground">{orderInfo.duration}</span>
          </div>
          
          <div className="flex items-start justify-between">
            <span className="font-semibold text-card-foreground">服务地址：</span>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-card-foreground">{orderInfo.address}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                ({orderInfo.distance})
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-card-foreground">预计提成：</span>
            <span className="text-lg font-bold text-primary">¥{orderInfo.payout}</span>
          </div>
        </div>

        {/* 倒计时 */}
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-primary mb-2 animate-pulse">
            {countdown.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-muted-foreground">秒后自动关闭</div>
        </div>

        {/* 抢单按钮 */}
        <Button 
          variant="default" 
          size="lg" 
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button"
          onClick={onGrab}
        >
          立即抢单
        </Button>
      </div>
    </div>
  );
};