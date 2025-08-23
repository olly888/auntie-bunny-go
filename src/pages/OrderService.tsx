import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PhotoUploader } from "@/components/orders/PhotoUploader";
import { CustomerNotes } from "@/components/orders/CustomerNotes";
import { useCurrentTask, useUpdateOrderStatus } from "@/hooks/orders/useCurrentTask";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Phone, Navigation, AlertTriangle, Camera, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OneClickExperienceButton } from "@/components/orders/OneClickExperienceButton";

type ServiceStatus = "departing" | "enroute" | "arrived" | "verification" | "serving" | "completed";

const OrderService = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  
  const { data: order, isLoading } = useCurrentTask();
  const updateOrderStatus = useUpdateOrderStatus();

  useEffect(() => {
    if (!orderId || !order) return;
    
    // If order ID doesn't match current task, redirect
    if (order.id !== orderId) {
      navigate('/workbench');
    }
  }, [orderId, order, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载订单信息...</p>
        </div>
      </div>
    );
  }

  // 改进空状态处理
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate('/workbench')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-semibold">订单详情</h1>
            <div className="w-8"></div>
          </div>
        </header>

        {/* Empty State */}
        <div className="flex items-center justify-center min-h-[60vh] p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">暂无当前任务</h2>
            <p className="text-muted-foreground mb-6">
              您当前没有进行中的订单任务。返回工作台抢单或体验演示流程。
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/workbench')}
                className="w-full"
              >
                返回工作台
              </Button>
              <div className="text-center">
                <OneClickExperienceButton />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 使用"一键体验"快速生成订单并体验完整服务流程
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const maskPhone = (phone: string) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  };

  const phoneDisplay = order.contact_phone ? maskPhone(order.contact_phone) : '暂无联系方式';
  const serviceNotes = ['#厨房油污重#']; // Mock data - could come from order

  const handleStatusChange = async (nextStatus: ServiceStatus) => {
    try {
      // Validation for verification step
      if (nextStatus === "serving" && verificationCode.length !== 4) {
        toast({
          title: "验证失败",
          description: "请输入正确的4位手机尾号",
          variant: "destructive"
        });
        return;
      }

      // Validation for completion step
      if (nextStatus === "completed" && photoCount === 0) {
        toast({
          title: "请上传照片",
          description: "完成服务前至少需要上传一张照片",
          variant: "destructive"
        });
        return;
      }

      // Map frontend status to backend status
      const statusMap: Record<ServiceStatus, string> = {
        departing: 'assigned',
        enroute: 'assigned', 
        arrived: 'assigned',
        verification: 'assigned',
        serving: 'in_progress',
        completed: 'completed'
      };

      const success = await updateOrderStatus(order.id, statusMap[nextStatus]);
      
      if (success) {
        if (nextStatus === "completed") {
          setShowNoteDialog(true);
        }
        toast({
          title: "状态更新成功",
          description: getStatusMessage(nextStatus)
        });
      } else {
        throw new Error("Status update failed");
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: "更新失败", 
        description: "请重试",
        variant: "destructive"
      });
    }
  };

  const getStatusMessage = (status: ServiceStatus) => {
    const messages = {
      departing: "已确认出发",
      enroute: "正在前往服务地点", 
      arrived: "已到达服务地点",
      verification: "开始身份验证",
      serving: "开始提供服务",
      completed: "服务已完成"
    };
    return messages[status];
  };

  const getCurrentServiceStatus = (): ServiceStatus => {
    if (!order.started_at) return "departing";
    if (!order.completed_at) return "serving"; 
    return "completed";
  };

  const getStatusButton = () => {
    const currentStatus = getCurrentServiceStatus();
    
    switch (currentStatus) {
      case "departing":
        return (
          <Button 
            variant="secondary" 
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
            className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
            size="xl" 
            onClick={() => handleStatusChange("arrived")}
          >
            我已到场
          </Button>
        );
      
      case "arrived":
        return (
          <Button 
            variant="default" 
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setVerificationCode(value);
              }}
              maxLength={4}
              inputMode="numeric"
              pattern="\d*"
              className="text-center text-lg"
            />
            <Button 
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
          <div className="space-y-4">
            <PhotoUploader orderId={order.id} onPhotosChange={setPhotoCount} />
            <Button 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              size="xl" 
              disabled={photoCount === 0}
              onClick={() => handleStatusChange("completed")}
            >
              <Camera className="mr-2" />
              完成服务 ({photoCount}张照片)
            </Button>
          </div>
        );
      
      case "completed":
        return (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-emerald-600 mb-2">服务已完成</h2>
            <p className="text-muted-foreground">感谢您的辛勤工作！</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/workbench')}
            >
              返回工作台
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/workbench')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-semibold">订单详情</h1>
          <Button variant="destructive" size="sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            求助
          </Button>
        </div>
      </header>

      {/* Map Area */}
      <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">地图导航区域</p>
          <p className="text-xs">{order.address}</p>
        </div>
        
        {/* Navigation button overlay */}
        <Button 
          className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white"
          size="sm"
          onClick={() => window.open(`https://uri.amap.com/navigation?to=${encodeURIComponent(order.address)}`, '_blank')}
        >
          <Navigation className="w-4 h-4 mr-1" />
          导航
        </Button>
      </div>

      {/* Bottom Sheet */}
      <Sheet open={true}>
        <SheetContent 
          side="bottom" 
          className="h-[60vh] rounded-t-3xl border-0 p-0"
        >
          <div className="p-6 space-y-6 overflow-y-auto h-full">
            <SheetHeader>
              <div className="w-12 h-1 bg-muted rounded-full mx-auto" />
              <SheetTitle className="text-center mt-4">订单信息</SheetTitle>
            </SheetHeader>

            {/* Order Details */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">服务地址</div>
                <div className="font-medium">{order.address}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">联系用户</div>
                  <div className="font-medium">{phoneDisplay}</div>
                </div>
                {order.contact_phone && (
                  <a href={`tel:${order.contact_phone}`}>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">服务项目</div>
                  <div className="font-medium">{order.type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">服务时长</div>
                  <div className="font-medium">{order.duration_minutes}分钟</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">预计提成</div>
                <div className="font-medium text-emerald-600">¥{order.payout}</div>
              </div>
              
              {serviceNotes.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">订单备注</div>
                  <div className="flex gap-2 flex-wrap">
                    {serviceNotes.map((note, index) => (
                      <Badge key={index} variant="secondary">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Notes */}
              {order.contact_phone && (
                <CustomerNotes 
                  customerPhone={order.contact_phone}
                  orderId={order.id}
                  showAddNote={getCurrentServiceStatus() === "completed"}
                />
              )}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              {getStatusButton()}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Note Dialog */}
      {showNoteDialog && order.contact_phone && (
        <Sheet open={showNoteDialog} onOpenChange={setShowNoteDialog}>
          <SheetContent side="bottom" className="h-96">
            <SheetHeader>
              <SheetTitle>添加服务备注</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <CustomerNotes 
                customerPhone={order.contact_phone}
                orderId={order.id}
                showAddNote={true}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default OrderService;
