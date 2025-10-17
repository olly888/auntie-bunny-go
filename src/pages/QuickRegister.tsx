import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const QuickRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    id_card_number: "",
    gender: "",
    age: ""
  });

  const handleSubmit = async (skipIdCard: boolean = false) => {
    // 验证必填字段
    if (!formData.full_name || !formData.id_card_number || !formData.gender || !formData.age) {
      toast.error("请填写完整信息", {
        description: "姓名、身份证号、性别和年龄为必填项"
      });
      return;
    }

    // 简单的身份证号验证
    if (formData.id_card_number.length !== 18) {
      toast.error("身份证号格式错误", {
        description: "请输入18位身份证号码"
      });
      return;
    }

    setLoading(true);
    try {
      const storedUser = localStorage.getItem("mock_user");
      if (!storedUser) {
        toast.error("未登录", { description: "请先登录" });
        navigate('/auth');
        return;
      }

      const user = JSON.parse(storedUser);

      // 保存profile到localStorage
      const profile = {
        id: user.id,
        full_name: formData.full_name,
        id_card_number: formData.id_card_number,
        gender: formData.gender,
        age: parseInt(formData.age),
        onboarding_status: 'registered',
        is_id_verified: false,
        is_training_completed: false,
        has_id_card_uploaded: !skipIdCard && (!!idCardFront || !!idCardBack),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem("mock_user_profile", JSON.stringify(profile));

      toast.success("注册成功！", {
        description: skipIdCard ? "您可以稍后在个人中心完善资料" : "您的信息已提交"
      });

      navigate('/workbench');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("注册失败", { description: "请重试" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">快速注册</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            仅需<span className="text-primary font-semibold">4项基础信息</span>，即可完成注册！<br />
            <span className="text-xs text-muted-foreground">更多资料可在后续随时完善</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 核心信息区 - 高亮显示 */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="default">必填信息</Badge>
              <span className="text-xs text-muted-foreground">仅需1分钟</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">真实姓名 *</Label>
              <Input
                id="fullName"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="请输入您的真实姓名"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idCard">身份证号码 *</Label>
              <Input
                id="idCard"
                value={formData.id_card_number}
                onChange={(e) => setFormData({ ...formData, id_card_number: e.target.value })}
                placeholder="请输入身份证号码"
                maxLength={18}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">性别 *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="选择" />
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
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="输入"
                />
              </div>
            </div>
          </div>
          
          {/* 可选上传区 - 弱化显示 */}
          <Card className="border-dashed border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                <Badge variant="secondary">可选上传</Badge>
                <p className="mt-2">提前上传可加快审核速度</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idCardFront">身份证正面</Label>
                <Input
                  id="idCardFront"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIdCardFront(e.target.files?.[0] || null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idCardBack">身份证背面（可选）</Label>
                <Input
                  id="idCardBack"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIdCardBack(e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* 操作按钮区 - 明确引导 */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-14 text-lg border-2 border-dashed"
              onClick={() => handleSubmit(true)}
              disabled={loading}
            >
              <span className="mr-2">⚡</span>
              跳过此步，先进入看看
            </Button>
            
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14"
              onClick={() => handleSubmit(false)}
              disabled={loading}
            >
              {loading ? "提交中..." : (idCardFront ? "✅ 立即上传并完成注册" : "完成注册")}
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            注册后可在【个人信息】随时完善资料
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickRegister;
