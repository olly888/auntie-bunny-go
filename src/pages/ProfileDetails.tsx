import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Upload, CheckCircle, Calendar } from "lucide-react";
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
  const [age, setAge] = useState<number | undefined>(undefined);
  const [education, setEducation] = useState("");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  
  // 认证信息
  const [idVerified, setIdVerified] = useState(false);
  const [healthCertUrl, setHealthCertUrl] = useState("");
  const [healthCertExpiry, setHealthCertExpiry] = useState<Date>();
  const [skillCertUrl, setSkillCertUrl] = useState("");
  const [skillCertType, setSkillCertType] = useState("");
  
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
        setAge(profile.age || undefined);
        setEducation(profile.education || "");
        setPhone(JSON.parse(storedUser).phone || "");
        setEmergencyContact(profile.emergency_contact || "");
        setEmergencyPhone(profile.emergency_phone || "");
        setEmploymentType(profile.employment_type || "");
        setEmployeeId(profile.employee_id || `TDD${Date.now()}`);
        setAvatar(profile.avatar_url || "");
        setIdVerified(profile.is_id_verified || false);
        setHealthCertUrl(profile.health_cert_url || "");
        setSkillCertUrl(profile.skill_cert_url || "");
        setSkillCertType(profile.skill_cert_type || "");
        
        if (profile.health_cert_expires_at) {
          setHealthCertExpiry(new Date(profile.health_cert_expires_at));
        }
        
        // 获取门店名称
        if (profile.store_id) {
          const { data } = await supabase
            .from('stores')
            .select('name')
            .eq('id', profile.store_id)
            .single();
          
          if (data) {
            setStoreName(data.name);
          }
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
      
      // 更新 user 的 phone（如果修改了）
      const storedUser = localStorage.getItem("mock_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.phone = phone;
        localStorage.setItem("mock_user", JSON.stringify(user));
      }
      
      // 更新profile
      const updatedProfile = {
        ...profile,
        full_name: fullName,
        id_card_number: idCardNumber,
        gender: gender,
        age: age,
        education: education,
        phone: phone,
        emergency_contact: emergencyContact,
        emergency_phone: emergencyPhone,
        employment_type: employmentType,
        avatar_url: avatar,
        employee_id: employeeId,
        is_id_verified: idVerified,
        health_cert_url: healthCertUrl,
        health_cert_expires_at: healthCertExpiry?.toISOString().split('T')[0],
        skill_cert_url: skillCertUrl,
        skill_cert_type: skillCertType,
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

  const handleImageUpload = async (type: 'avatar' | 'health' | 'skill') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // MVP阶段使用本地预览
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        switch (type) {
          case 'avatar':
            setAvatar(result);
            break;
          case 'health':
            setHealthCertUrl(result);
            break;
          case 'skill':
            setSkillCertUrl(result);
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
              <Label className="flex items-center gap-2">
                姓名
                {idVerified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    已认证
                  </Badge>
                )}
              </Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={idVerified ? "" : "请先完成实名认证"}
                disabled={idVerified}
                className={cn(idVerified && "bg-muted cursor-not-allowed")}
              />
              {idVerified && (
                <p className="text-xs text-muted-foreground">
                  实名认证后不可修改
                </p>
              )}
            </div>

            {/* 身份证号码 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                身份证号码
                {idVerified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    已认证
                  </Badge>
                )}
              </Label>
              <Input
                value={idCardNumber}
                onChange={(e) => setIdCardNumber(e.target.value)}
                placeholder={idVerified ? "" : "请先完成实名认证"}
                disabled={idVerified}
                className={cn(idVerified && "bg-muted cursor-not-allowed")}
                maxLength={18}
              />
              {idVerified && (
                <p className="text-xs text-muted-foreground">
                  实名认证后不可修改
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

            {/* 年龄 */}
            <div className="space-y-2">
              <Label>年龄</Label>
              <Input
                type="number"
                value={age || ""}
                onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="请输入年龄"
                min={18}
                max={70}
              />
            </div>

            {/* 学历 */}
            <div className="space-y-2">
              <Label>学历</Label>
              <Select value={education} onValueChange={setEducation}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择学历" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="小学">小学</SelectItem>
                  <SelectItem value="初中">初中</SelectItem>
                  <SelectItem value="高中/中专">高中/中专</SelectItem>
                  <SelectItem value="大专">大专</SelectItem>
                  <SelectItem value="本科">本科</SelectItem>
                  <SelectItem value="硕士及以上">硕士及以上</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 电话 */}
            <div className="space-y-2">
              <Label>电话</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号码"
                type="tel"
                maxLength={11}
              />
            </div>

            {/* 所属门店 */}
            <div className="space-y-2">
              <Label>所属门店</Label>
              <Input
                value={storeName || "未分配"}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                由管理员分配，无法自行修改
              </p>
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
            {/* 身份证认证状态 */}
            {idVerified ? (
              <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">身份证认证</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 ml-auto">
                    已认证
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  您已完成实名认证，身份证信息已安全存储，无需重复上传。
                </p>
              </div>
            ) : (
              <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-orange-700">身份证认证</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 ml-auto">
                    未认证
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  完成实名认证后才能接单赚钱
                </p>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/certification')}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  去认证
                </Button>
              </div>
            )}

            {/* 健康证 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>健康证</Label>
                <Badge variant={healthCertUrl ? "default" : "secondary"}>
                  {healthCertUrl ? "已上传" : "未上传"}
                </Badge>
              </div>
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
                    <span className="text-xs text-muted-foreground mt-1">可选，建议上传以提升接单率</span>
                  </>
                )}
              </div>

              {/* 健康证有效期 */}
              {healthCertUrl && (
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
              )}
            </div>

            {/* 职业技能证书 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>职业技能证书</Label>
                <Badge variant={skillCertUrl ? "default" : "secondary"}>
                  {skillCertUrl ? "已上传" : "未上传"}
                </Badge>
              </div>

              {skillCertUrl && (
                <div className="space-y-2">
                  <Label>证书类型</Label>
                  <Select value={skillCertType} onValueChange={setSkillCertType}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择证书类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="家政师资格证">家政师资格证</SelectItem>
                      <SelectItem value="育婴师证">育婴师证</SelectItem>
                      <SelectItem value="保洁师证">保洁师证</SelectItem>
                      <SelectItem value="养老护理员证">养老护理员证</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div
                className="aspect-[3/2] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleImageUpload('skill')}
              >
                {skillCertUrl ? (
                  <img src={skillCertUrl} alt="职业技能证书" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">点击上传职业技能证书</span>
                    <span className="text-xs text-muted-foreground mt-1">可选，有证书可提升接单竞争力</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <Button
          className="w-full h-12"
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
