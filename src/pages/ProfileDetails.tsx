import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Lock, Upload, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function ProfileDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 基础信息
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  
  // 认证信息
  const [idCardFrontUrl, setIdCardFrontUrl] = useState("");
  const [idCardBackUrl, setIdCardBackUrl] = useState("");
  const [idVerified, setIdVerified] = useState(false);
  const [healthCertUrl, setHealthCertUrl] = useState("");
  const [healthCertExpiry, setHealthCertExpiry] = useState<Date>();
  const [healthVerified, setHealthVerified] = useState(false);
  
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedUser = localStorage.getItem("mock_user");
      if (!storedUser) {
        navigate('/auth');
        return;
      }

      const storedProfile = localStorage.getItem("mock_user_profile");
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setFullName(profile.full_name || "");
        setIdCardNumber(profile.id_card_number || "");
        setGender(profile.gender || "");
        setPhone(JSON.parse(storedUser).phone || "");
        setEmergencyContact(profile.emergency_contact || "");
        setEmergencyPhone(profile.emergency_phone || "");
        setEmploymentType(profile.employment_type || "");
        setEmployeeId(profile.employee_id || `TDD${Date.now()}`);
        setAvatar(profile.avatar_url || "");
        setIdVerified(profile.is_id_verified || false);
        setIdCardFrontUrl(profile.id_card_front_url || "");
        setIdCardBackUrl(profile.id_card_back_url || "");
        setHealthCertUrl(profile.health_cert_url || "");
        if (profile.health_cert_expires_at) {
          setHealthCertExpiry(new Date(profile.health_cert_expires_at));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("加载失败", { description: "无法加载个人信息" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const storedProfile = localStorage.getItem("mock_user_profile");
      if (!storedProfile) return;

      const profile = JSON.parse(storedProfile);
      
      // 更新profile
      const updatedProfile = {
        ...profile,
        full_name: fullName,
        id_card_number: idCardNumber,
        gender: gender,
        emergency_contact: emergencyContact,
        emergency_phone: emergencyPhone,
        employment_type: employmentType,
        avatar_url: avatar,
        employee_id: employeeId,
        id_card_front_url: idCardFrontUrl,
        id_card_back_url: idCardBackUrl,
        is_id_verified: idVerified,
        health_cert_url: healthCertUrl,
        health_cert_expires_at: healthCertExpiry?.toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      };

      localStorage.setItem("mock_user_profile", JSON.stringify(updatedProfile));
      toast.success("保存成功", { description: "个人信息已更新" });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("保存失败", { description: "请重试" });
    } finally {
      setSaving(false);
    }
  };

  const handleIdVerification = () => {
    if (!idCardFrontUrl || !idCardBackUrl) {
      toast.error("请先上传身份证照片");
      return;
    }

    toast.info("正在跳转实名认证...", {
      description: "请按照指引完成人脸识别"
    });

    // 模拟认证
    setTimeout(() => {
      setIdVerified(true);
      
      // 更新localStorage
      const storedProfile = localStorage.getItem("mock_user_profile");
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        profile.is_id_verified = true;
        profile.id_card_front_url = idCardFrontUrl;
        profile.id_card_back_url = idCardBackUrl;
        
        // 检查是否满足激活条件
        if (profile.is_training_completed) {
          profile.onboarding_status = 'activated';
          toast.success("🎉 恭喜激活成功！", {
            description: "您现在可以开始接单赚钱了！"
          });
          localStorage.setItem("mock_user_profile", JSON.stringify(profile));
          setTimeout(() => navigate('/workbench'), 1500);
        } else {
          localStorage.setItem("mock_user_profile", JSON.stringify(profile));
          toast.success("实名认证完成！", {
            description: "还差最后一步：完成新人培训"
          });
        }
      }
    }, 2000);
  };

  const handleImageUpload = async (type: 'avatar' | 'id_front' | 'id_back' | 'health') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // MVP阶段使用本地预览，实际应上传到Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        switch (type) {
          case 'avatar':
            setAvatar(result);
            break;
          case 'id_front':
            setIdCardFrontUrl(result);
            break;
          case 'id_back':
            setIdCardBackUrl(result);
            break;
          case 'health':
            setHealthCertUrl(result);
            break;
        }
      };
      reader.readAsDataURL(file);
      
      toast.success("照片已选择", { description: "记得点击保存按钮" });
    };
    
    input.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">个人信息</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 基础信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基础信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 头像 */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-2xl">
                  {fullName?.[0] || "用"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleImageUpload('avatar')}
              >
                <Camera className="w-4 h-4 mr-2" />
                更换头像
              </Button>
            </div>

            {/* 姓名 */}
            <div className="space-y-2">
              <Label>姓名</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="请输入姓名"
              />
            </div>

            {/* 身份证号码 */}
            <div className="space-y-2">
              <Label>身份证号码</Label>
              <div className="relative">
                <Input
                  value={idCardNumber}
                  onChange={(e) => setIdCardNumber(e.target.value)}
                  placeholder="请输入身份证号码"
                  disabled={!!idCardNumber}
                  className={cn(idCardNumber && "pr-10")}
                />
                {idCardNumber && (
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                )}
              </div>
              {idCardNumber && (
                <p className="text-xs text-muted-foreground">
                  身份证号码一旦提交将无法修改
                </p>
              )}
            </div>

            {/* 性别 */}
            <div className="space-y-2">
              <Label>性别</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 电话 */}
            <div className="space-y-2">
              <Label>电话</Label>
              <Input value={phone} disabled className="bg-muted" />
            </div>

            {/* 紧急联系人 */}
            <div className="space-y-2">
              <Label>紧急联系人</Label>
              <Input
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="请输入紧急联系人姓名"
              />
            </div>

            {/* 紧急联系电话 */}
            <div className="space-y-2">
              <Label>紧急联系电话</Label>
              <Input
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="请输入紧急联系电话"
                type="tel"
              />
            </div>

            {/* 全职/兼职 */}
            <div className="space-y-2">
              <Label>工作类型</Label>
              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择工作类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全职">全职</SelectItem>
                  <SelectItem value="兼职">兼职</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 工号 */}
            <div className="space-y-2">
              <Label>工号</Label>
              <Input value={employeeId} disabled className="bg-muted" />
            </div>
          </CardContent>
        </Card>

        {/* 上传资料 */}
        <Card>
          <CardHeader>
            <CardTitle>上传资料</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 身份证 */}
            <div className="space-y-3">
              <Label>身份证照片</Label>
              <div className="grid grid-cols-2 gap-4">
                {/* 身份证正面 */}
                <div className="space-y-2">
                  <div
                    className="aspect-[3/2] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleImageUpload('id_front')}
                  >
                    {idCardFrontUrl ? (
                      <img src={idCardFrontUrl} alt="身份证正面" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">人像面</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 身份证国徽面 */}
                <div className="space-y-2">
                  <div
                    className="aspect-[3/2] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleImageUpload('id_back')}
                  >
                    {idCardBackUrl ? (
                      <img src={idCardBackUrl} alt="身份证国徽面" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">国徽面</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 实名认证按钮 */}
              {idVerified ? (
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    已认证
                  </Badge>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleIdVerification}
                  disabled={!idCardFrontUrl || !idCardBackUrl}
                  className="w-full"
                >
                  去认证
                </Button>
              )}
            </div>

            {/* 健康证 */}
            <div className="space-y-3">
              <Label>健康证</Label>
              <div
                className="aspect-[3/2] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleImageUpload('health')}
              >
                {healthCertUrl ? (
                  <img src={healthCertUrl} alt="健康证" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">点击上传健康证</span>
                  </>
                )}
              </div>

              {/* 健康证有效期 */}
              <div className="space-y-2">
                <Label>健康证有效期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !healthCertExpiry && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {healthCertExpiry ? format(healthCertExpiry, "yyyy-MM-dd") : "选择有效期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={healthCertExpiry}
                      onSelect={setHealthCertExpiry}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 健康证状态 */}
              {healthCertUrl && healthCertExpiry ? (
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    已认证
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    有效期至：{format(healthCertExpiry, "yyyy-MM-dd")}
                  </span>
                </div>
              ) : (
                <Badge variant="secondary">去上传</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "保存中..." : "保存"}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
