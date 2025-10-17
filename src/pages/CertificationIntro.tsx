import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Info } from "lucide-react";

const CertificationIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">实名认证</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Step 1: ID Card Scanning */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            第一步 扫描身份证件
          </h2>

          <div className="flex items-start gap-6">
            {/* ID Card Mockup */}
            <div className="flex-shrink-0 w-40 h-28 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg border-2 border-blue-400 flex items-center justify-center relative shadow-md">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-blue-400"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-blue-400"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-blue-400"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-blue-400"></div>

              {/* ID Card Content */}
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-200 rounded-full mx-auto mb-2"></div>
                <div className="space-y-1">
                  <div className="h-2 w-16 bg-blue-200 rounded mx-auto"></div>
                  <div className="h-2 w-20 bg-blue-200 rounded mx-auto"></div>
                  <div className="h-2 w-14 bg-blue-200 rounded mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-foreground">光线充足</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-foreground">证件平放</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-foreground">避免反光</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Face Recognition */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            第二步 人脸识别
          </h2>

          <div className="flex items-start gap-6">
            {/* Face Recognition Mockup */}
            <div className="flex-shrink-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full border-4 border-blue-400 flex items-center justify-center relative shadow-md">
              {/* Crosshair guides */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-blue-200"></div>
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-blue-200"></div>

              {/* Face silhouette */}
              <div className="w-20 h-24 bg-blue-200 rounded-full"></div>
            </div>

            {/* Checklist */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-foreground">光线充足</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-foreground">本人操作</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-foreground">正脸对准</span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-3 p-4 bg-muted rounded-lg border">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            系统会采集您的身份信息和人脸动作图像信息进行身份比对，请确认同意进行信息采集。我们承诺您的信息将受到严格保护，仅用于身份验证。
          </p>
        </div>

        {/* CTA Button */}
        <Button
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          onClick={() => navigate("/certification/process")}
        >
          同意并开始认证
        </Button>
      </div>
    </div>
  );
};

export default CertificationIntro;
