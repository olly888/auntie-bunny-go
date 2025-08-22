import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Navigation, AlertTriangle, Camera } from "lucide-react";

type ServiceStatus = "departing" | "enroute" | "arrived" | "verification" | "serving" | "completed";

const OrderService = () => {
  const [status, setStatus] = useState<ServiceStatus>("departing");
  const [verificationCode, setVerificationCode] = useState("");

  // 订单信息
  const orderInfo = {
    address: "深圳市南山区xx小区 A栋 1201",
    phone: "138****1234",
    notes: ["#家有宠物#", "#厨房油污重#"]
  };

  const handleStatusChange = (nextStatus: ServiceStatus) => {
    if (nextStatus === "verification") {
      setStatus(nextStatus);
    } else if (nextStatus === "serving" && verificationCode.length === 4) {
      setStatus(nextStatus);
    } else {
      setStatus(nextStatus);
    }
  };

  const getStatusButton = () => {
    switch (status) {
      case "departing":
        return (
          <Button 
            variant="primary" 
            size="xl" 
            className="w-full"
            onClick={() => handleStatusChange("enroute")}
          >
            我已出发
          </Button>
        );
      
      case "enroute":
        return (
          <Button 
            variant="primary" 
            size="xl" 
            className="w-full"
            onClick={() => handleStatusChange("arrived")}
          >
            我已到场
          </Button>
        );
      
      case "arrived":
        return (
          <Button 
            variant="primary" 
            size="xl" 
            className="w-full"
            onClick={() => handleStatusChange("verification")}
          >
            开始验证
          </Button>
        );
      
      case "verification":
        return (
          <div className="space-y-4">
            <Input
              placeholder="请输入用户手机尾号后4位"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={4}
              className="text-center text-lg"
            />
            <Button 
              variant="primary" 
              size="xl" 
              className="w-full"
              disabled={verificationCode.length !== 4}
              onClick={() => handleStatusChange("serving")}
            >
              确认并开始服务
            </Button>
          </div>
        );
      
      case "serving":
        return (
          <Button 
            variant="success" 
            size="xl" 
            className="w-full"
            onClick={() => handleStatusChange("completed")}
          >
            <Camera className="mr-2" />
            上传照片并完成服务
          </Button>
        );
      
      case "completed":
        return (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-success mb-2">服务已完成</h2>
            <p className="text-muted-foreground">感谢您的辛勤工作！</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* 紧急求助按钮 */}
      <div className="flex justify-end p-4">
        <Button variant="destructive" size="sm">
          <AlertTriangle className="w-4 h-4 mr-1" />
          紧急求助
        </Button>
      </div>

      <div className="max-w-md mx-auto px-4 pb-6 space-y-6">
        
        {/* 用户信息区 */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4">用户信息</h2>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">服务地址</div>
              <div className="font-medium">{orderInfo.address}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">联系用户</div>
                <div className="font-medium">{orderInfo.phone}</div>
              </div>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-2">订单备注</div>
              <div className="flex gap-2">
                {orderInfo.notes.map((note, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 地图导航区 */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4">地图导航</h2>
          
          {/* 模拟地图 */}
          <div className="bg-gradient-to-br from-accent/20 to-accent/40 rounded-lg h-32 flex items-center justify-center mb-4">
            <div className="text-center text-muted-foreground">
              <Navigation className="w-8 h-8 mx-auto mb-2" />
              <div>地图导航区域</div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            <Navigation className="w-4 h-4 mr-2" />
            使用高德地图导航
          </Button>
        </div>

        {/* 状态操作区 */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4">服务状态</h2>
          {getStatusButton()}
        </div>
      </div>
    </div>
  );
};

export default OrderService;