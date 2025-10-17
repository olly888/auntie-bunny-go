import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const QuickRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    idCardNumber: "",
    gender: "",
    age: ""
  });

  const handleSubmit = async (skipIdCard: boolean = false) => {
    if (!formData.fullName || !formData.idCardNumber || !formData.gender || !formData.age) {
      toast.error("请填写所有必填信息");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("用户未登录");
        navigate("/auth");
        return;
      }

      // 创建profile（状态为registered）
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        full_name: formData.fullName,
        id_card_number: formData.idCardNumber,
        gender: formData.gender,
        age: parseInt(formData.age),
        onboarding_status: 'registered',
        is_id_verified: false,
        is_training_completed: false
      });

      if (profileError) {
        toast.error("创建账户失败：" + profileError.message);
        return;
      }

      // 如果上传了身份证，创建认证记录
      if (!skipIdCard && idCardFront) {
        // 上传身份证照片到storage
        const frontFileName = `${user.id}/id_front_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('order-photos')
          .upload(frontFileName, idCardFront);

        if (uploadError) {
          console.error("上传身份证正面失败：", uploadError);
        }

        const frontUrl = supabase.storage.from('order-photos').getPublicUrl(frontFileName).data.publicUrl;
        
        let backUrl = null;
        if (idCardBack) {
          const backFileName = `${user.id}/id_back_${Date.now()}.jpg`;
          await supabase.storage.from('order-photos').upload(backFileName, idCardBack);
          backUrl = supabase.storage.from('order-photos').getPublicUrl(backFileName).data.publicUrl;
        }

        // 创建认证记录
        await supabase.from('provider_certifications').insert({
          provider_id: user.id,
          id_card_front_url: frontUrl,
          id_card_back_url: backUrl,
          id_card_number: formData.idCardNumber
        });
      }

      toast.success("注册成功！");
      navigate('/workbench');
    } catch (error) {
      console.error("注册错误：", error);
      toast.error("注册失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">快速注册</CardTitle>
          <CardDescription>
            仅需4项基础信息，即可完成注册！<br />
            更多资料可在后续随时完善
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">真实姓名 *</Label>
            <Input
              id="fullName"
              placeholder="请输入您的真实姓名"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idCardNumber">身份证号码 *</Label>
            <Input
              id="idCardNumber"
              placeholder="请输入身份证号码"
              maxLength={18}
              value={formData.idCardNumber}
              onChange={(e) => setFormData({ ...formData, idCardNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">性别 *</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="请选择性别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="男">男</SelectItem>
                <SelectItem value="女">女</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">年龄 *</Label>
            <Input
              id="age"
              type="number"
              placeholder="请输入年龄"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <Card className="border-dashed border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                上传身份证（可跳过）
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idCardFront">身份证正面</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="idCardFront"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdCardFront(e.target.files?.[0] || null)}
                  />
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCardBack">身份证背面（可选）</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="idCardBack"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdCardBack(e.target.files?.[0] || null)}
                  />
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-14 text-lg border-2"
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            跳过此步，先进入看看 →
          </Button>
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14"
            onClick={() => handleSubmit(false)}
            disabled={loading}
          >
            {idCardFront ? "立即上传并完成注册" : "完成注册"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickRegister;
