import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, MapPin } from "lucide-react";

const OrderGrab = () => {
  const [countdown, setCountdown] = useState(10);
  const [isVisible, setIsVisible] = useState(true);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [countdown]);

  // 抢单信息
  const orderInfo = {
    type: "🐰 洗碗兔",
    duration: "30分钟",
    address: "xx小区",
    distance: "距您约5分钟"
  };

  const handleGrabOrder = () => {
    // 抢单逻辑
    console.log("抢单成功！");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-scale-in">
        
        {/* 响铃图标 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4 animate-bounce">
            <Bell className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">新订单！</h1>
        </div>

        {/* 订单信息 */}
        <div className="bg-gradient-card rounded-xl p-6 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">服务类型：</span>
            <span className="text-lg font-bold text-primary">{orderInfo.type}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold">预估时长：</span>
            <span>{orderInfo.duration}</span>
          </div>
          
          <div className="flex items-start justify-between">
            <span className="font-semibold">服务地址：</span>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{orderInfo.address}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                ({orderInfo.distance})
              </div>
            </div>
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
          variant="primary" 
          size="xl" 
          className="w-full"
          onClick={handleGrabOrder}
        >
          立即抢单
        </Button>
      </div>
    </div>
  );
};

export default OrderGrab;