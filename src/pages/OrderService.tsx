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
import { Phone, Navigation, AlertTriangle, Camera, ArrowLeft, MapPin, Clock, DollarSign, User, FileText } from "lucide-react";
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

  // Load customer notes when component mounts
  useEffect(() => {
    loadCustomerNotes();
  }, []);

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
    navigate('/workbench');
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
            上传照片并完成服务
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
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>
        
        <h1 className="font-semibold">订单详情</h1>
        
        {status === "serving" && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setShowEmergencyDialog(true)}
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            紧急求助
          </Button>
        )}
        
        {status !== "serving" && <div className="w-20" />}
      </div>

      {/* Real-time Map Area */}
      <div className="flex-1 p-4">
        <ServiceMap
          workerLocation={{ lng: 114.057, lat: 22.543 }} // Mock current location
          destination={{ lng: orderInfo.longitude, lat: orderInfo.latitude }}
          destinationAddress={orderInfo.address}
        />
      </div>

      {/* Bottom Sheet - Order Info & Actions */}
      <Drawer open={bottomSheetOpen} onOpenChange={setBottomSheetOpen}>
        <DrawerContent className="max-h-[70vh]">
          <DrawerHeader>
            <DrawerTitle>订单信息与操作</DrawerTitle>
          </DrawerHeader>
          
          <div className="p-4 space-y-6 overflow-y-auto">
            
            {/* Core Order Information */}
            <Card className="p-4 space-y-3">
              <h3 className="font-medium mb-3">订单核心信息</h3>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">服务地址</div>
                  <div className="font-medium">{orderInfo.address}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">联系用户</div>
                    <div className="font-medium">{orderInfo.phoneDisplay}</div>
                  </div>
                </div>
                <a href={`tel:${orderInfo.phone}`}>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">服务项目</div>
                  <div className="font-medium">{orderInfo.serviceItem}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">服务时长</div>
                  <div className="font-medium">{orderInfo.duration} 分钟</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">预计提成</div>
                  <div className="font-medium text-green-600">¥{orderInfo.commissionEstimate}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-2">订单备注</div>
                  <div className="flex gap-2 flex-wrap">
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
            </Card>

            {/* Service Experience Knowledge Base */}
            {customerNotes.length > 0 && (
              <Card className="p-4 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  💡 上次服务小贴士 (由同事提供)
                </h3>
                <div className="space-y-2">
                  {customerNotes.map((note) => (
                    <div key={note.id} className="text-sm bg-background p-2 rounded border">
                      "{note.content}"
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Status-Driven Action Button */}
            <div className="pb-4">
              {getStatusButton()}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Emergency Help Dialog */}
      <AlertDialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
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