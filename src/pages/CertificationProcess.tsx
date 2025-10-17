import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, Check, Loader2 } from "lucide-react";

const CertificationProcess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"info" | "id-scan" | "face-recognition" | "processing">("info");
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");

  const handleStartIdScan = () => {
    if (!fullName || !idNumber) {
      toast({
        title: "请填写完整信息",
        description: "请输入您的真实姓名和身份证号码",
        variant: "destructive",
      });
      return;
    }

    if (idNumber.length !== 18) {
      toast({
        title: "身份证号码格式错误",
        description: "请输入18位身份证号码",
        variant: "destructive",
      });
      return;
    }

    setStep("id-scan");
  };

  const handleIdScanComplete = () => {
    toast({
      title: "身份证扫描成功！",
      description: "正在进行OCR识别...",
    });

    setTimeout(() => {
      setStep("face-recognition");
    }, 1500);
  };

  const handleFaceRecognitionComplete = () => {
    setStep("processing");

    // 模拟处理过程
    setTimeout(() => {
      const profile = JSON.parse(localStorage.getItem("mock_user_profile") || "{}");
      profile.is_id_verified = true;
      profile.full_name = fullName;
      profile.id_card_number = idNumber;

      // 检查是否可以激活
      if (profile.is_training_completed) {
        profile.onboarding_status = "activated";
        localStorage.setItem("mock_user_profile", JSON.stringify(profile));
        
        toast({
          title: "🎉 恭喜激活成功！",
          description: "您现在可以开始接单赚钱了！",
          duration: 5000,
        });
      } else {
        localStorage.setItem("mock_user_profile", JSON.stringify(profile));
        
        toast({
          title: "✅ 实名认证完成！",
          description: "还差最后一步：完成新人培训即可激活",
          duration: 5000,
        });
      }

      setTimeout(() => navigate("/workbench"), 2000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => step === "info" ? navigate(-1) : setStep("info")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">实名认证</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        {/* Step 1: Basic Info */}
        {step === "info" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-base font-semibold">
                    真实姓名
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="请输入您的真实姓名"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 text-base mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="idNumber" className="text-base font-semibold">
                    身份证号码
                  </Label>
                  <Input
                    id="idNumber"
                    type="text"
                    placeholder="请输入18位身份证号码"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="h-12 text-base mt-2"
                    maxLength={18}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
              onClick={handleStartIdScan}
            >
              下一步：扫描身份证
            </Button>
          </div>
        )}

        {/* Step 2: ID Card Scanning */}
        {step === "id-scan" && (
          <div className="space-y-6">
            <Card className="border-2 border-primary">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">扫描身份证正面</h3>
                <p className="text-muted-foreground mb-6">
                  请确保证件平放、光线充足、避免反光
                </p>
                <Button
                  className="w-full h-14 text-lg font-semibold"
                  onClick={handleIdScanComplete}
                >
                  模拟扫描完成
                </Button>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <p>提示：实际环境中将调用摄像头进行拍摄</p>
            </div>
          </div>
        )}

        {/* Step 3: Face Recognition */}
        {step === "face-recognition" && (
          <div className="space-y-6">
            <Card className="border-2 border-primary">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-20 h-24 bg-primary/30 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">人脸识别</h3>
                <p className="text-muted-foreground mb-6">
                  请保持正脸对准屏幕，确保光线充足
                </p>
                <Button
                  className="w-full h-14 text-lg font-semibold"
                  onClick={handleFaceRecognitionComplete}
                >
                  模拟识别完成
                </Button>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <p>提示：实际环境中将调用人脸识别SDK</p>
            </div>
          </div>
        )}

        {/* Step 4: Processing */}
        {step === "processing" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">正在处理中...</h3>
                <p className="text-muted-foreground">
                  正在验证您的身份信息，请稍候
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationProcess;
