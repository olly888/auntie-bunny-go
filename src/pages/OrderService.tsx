import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Lightbulb, AlertCircle, Navigation, Camera, ArrowLeft } from "lucide-react";
import ServiceMap from "@/components/map/ServiceMap";
import PhotoUploadDialog from "@/components/order/PhotoUploadDialog";
import ServiceNotesModal from "@/components/order/ServiceNotesModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type ServiceStatus = "departing" | "enroute" | "arrived" | "verification" | "serving" | "completed";

interface CustomerNote {
  id: string;
  content: string;
  author_id: string;
  author_name?: string;
  created_at: string;
}

const OrderService = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<ServiceStatus>("departing");
  const [verificationCode, setVerificationCode] = useState("");
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(true);
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [serviceStartAt, setServiceStartAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Mock order data - in real app, fetch from Supabase based on orderId
  const orderInfo = {
    id: orderId || "mock-order-id",
    address: "深圳市南山区xx小区 A栋 1201",
    phone: "13812341234",
    phoneDisplay: "138****1234",
    notes: ["#家有宠物#", "#厨房油污重#"],
    serviceItem: "厨房深清",
    serviceTime: "今天 14:00-16:00",
    duration: 30,
    commissionEstimate: 25.0,
    latitude: 22.5431,
    longitude: 114.0579
  };

  // Initialize remaining seconds based on order duration
  useEffect(() => {
    setRemainingSeconds(orderInfo.duration * 60);
  }, [orderInfo.duration]);

  // Load customer notes when component mounts
  useEffect(() => {
    loadCustomerNotes();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (status !== 'serving' || serviceStartAt === null) return;
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - serviceStartAt) / 1000);
      const remaining = Math.max(orderInfo.duration * 60 - elapsed, 0);
      setRemainingSeconds(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, serviceStartAt, orderInfo.duration]);

  const loadCustomerNotes = async () => {
    setLoadingNotes(true);
    try {
      const { data, error } = await (supabase as any)
        .from('customer_notes')
        .select('*')
        .eq('customer_phone', orderInfo.phone)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setCustomerNotes(data || []);
    } catch (error) {
      console.error('Load customer notes error:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleStatusChange = (nextStatus: ServiceStatus) => {
    if (nextStatus === "verification") {
      setStatus(nextStatus);
    } else if (nextStatus === "serving" && verificationCode.length === 4) {
      setServiceStartAt(Date.now());
      setRemainingSeconds(orderInfo.duration * 60);
      setStatus(nextStatus);
      toast({
        title: "验证成功",
        description: "已开始服务，请认真完成工作",
      });
    } else {
      setStatus(nextStatus);
    }
  };

  const handleNavigateToDestination = () => {
    const amapUrl = `https://uri.amap.com/navigation?to=${orderInfo.longitude},${orderInfo.latitude},${encodeURIComponent(orderInfo.address)}`;
    window.open(amapUrl, '_blank');
    handleStatusChange("enroute");
  };

  const handleCompleteService = () => {
    setShowPhotoDialog(true);
  };

  const handlePhotoUploadComplete = () => {
    setStatus("completed");
    setShowNotesModal(true);
  };

  const handleNotesComplete = () => {
    toast({
      title: "服务完成",
      description: "感谢您的辛勤工作！",
    });
    navigate('/workbench', { state: { activeTab: 'in-progress' } });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getStatusButton = () => {
    switch (status) {
      case "departing":
        return (
          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={handleNavigateToDestination}
          >
            <Navigation className="mr-2 w-4 h-4" />
            我已出发 (开始导航)
          </Button>
        );
      
      case "enroute":
        return (
          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={() => handleStatusChange("arrived")}
          >
            我已到场
          </Button>
        );
      
      case "arrived":
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
              variant="default" 
              size="lg" 
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
              variant="default" 
              size="lg" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleCompleteService}
            >
              <Camera className="mr-2 w-4 h-4" />
              完成服务 (可选择上传照片)
            </Button>
        );
      
      case "completed":
        return (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">服务已完成</h2>
            <p className="text-muted-foreground">感谢您的辛勤工作！</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navigation - Fixed height */}
      <div className="flex items-center justify-between p-4 border-b bg-background z-10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/workbench', { state: { activeTab: 'in-progress' } })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        
        <h1 className="font-medium">服务详情</h1>
        
        <div className="w-16" />
      </div>

      {/* Map Section - Flexible height */}
      <ServiceMap 
        workerLocation={{ lng: 114.057, lat: 22.543 }}
        destination={{ lng: orderInfo.longitude, lat: orderInfo.latitude }}
        destinationAddress={orderInfo.address}
      />

      {/* Bottom Drawer - Non-modal overlay */}
      <Drawer open={true}>
        <DrawerContent className="max-h-[65vh] border-t-2">
          <DrawerHeader className="pb-2">
            <div className="flex items-center justify-between">
              {status === 'serving' && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setShowEmergencyDialog(true)}
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  紧急求助
                </Button>
              )}
              
              {status !== 'serving' && <div />}
              
              {status === 'serving' && (
                <div className="text-sm font-medium text-orange-600">
                  倒计时 {formatTime(remainingSeconds)}
                </div>
              )}
            </div>
            <DrawerTitle className="text-base mt-2">订单信息</DrawerTitle>
          </DrawerHeader>
          
          <div className="px-4 pb-6 space-y-4 overflow-y-auto">
            {/* Order Details */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">服务类型</span>
                <span className="font-medium">{orderInfo.serviceItem}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">服务时长</span>
                <span className="font-medium">{orderInfo.duration}分钟</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">服务费用</span>
                <span className="font-medium text-primary">¥{orderInfo.commissionEstimate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">联系方式</span>
                <span className="font-medium">{orderInfo.phoneDisplay}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">服务地址</span>
                <span className="font-medium">{orderInfo.address}</span>
              </div>
            </div>

            {/* User Order Notes */}
            {orderInfo.notes && orderInfo.notes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm text-muted-foreground">用户订单备注</h3>
                <div className="flex flex-wrap gap-2">
                  {orderInfo.notes.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Notes */}
            {customerNotes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  服务经验分享
                </h3>
                {customerNotes.map((note, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="mb-1">{note.content}</p>
                    <p className="text-xs text-muted-foreground">
                      由 {note.author_name || '同事'} 分享
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Status Action Button */}
            {getStatusButton()}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Emergency Help Dialog */}
      <AlertDialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              紧急求助
            </AlertDialogTitle>
            <AlertDialogDescription>
              如遇紧急情况，请立即联系客服或拨打紧急电话。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <Button variant="destructive">
              联系客服
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Photo Upload Dialog */}
      <PhotoUploadDialog
        open={showPhotoDialog}
        onOpenChange={setShowPhotoDialog}
        orderId={orderInfo.id}
        onUploadComplete={handlePhotoUploadComplete}
      />

      {/* Service Notes Modal */}
      <ServiceNotesModal
        open={showNotesModal}
        onOpenChange={setShowNotesModal}
        orderId={orderInfo.id}
        customerPhone={orderInfo.phone}
        onComplete={handleNotesComplete}
      />
    </div>
  );
};

export default OrderService;