import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Clock, ChevronDown, CheckCircle2, XCircle } from "lucide-react";

const QuickRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);
  const [idCardValid, setIdCardValid] = useState<boolean | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    id_card_number: "",
    gender: "",
    birth_year: ""
  });

  // 实时验证身份证号
  const validateIdCard = (value: string) => {
    if (value.length === 18) {
      const valid = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(value);
      setIdCardValid(valid);
    } else {
      setIdCardValid(null);
    }
  };

  const handleIdCardChange = (value: string) => {
    setFormData({ ...formData, id_card_number: value });
    validateIdCard(value);
  };

  const handleSubmit = async () => {
    // 验证必填字段
    if (!formData.full_name || !formData.id_card_number || !formData.gender || !formData.birth_year) {
      toast.error("请填写完整信息", {
        description: "姓名、身份证号、性别和出生年份为必填项"
      });
      return;
    }

    // 验证身份证号
    if (formData.id_card_number.length !== 18 || idCardValid === false) {
      toast.error("身份证号格式错误", {
        description: "请输入正确的18位身份证号码"
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
        birth_year: parseInt(formData.birth_year),
        onboarding_status: 'registered',
        is_id_verified: false,
        is_training_completed: false,
        has_id_card_uploaded: !!(idCardFront || idCardBack),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem("mock_user_profile", JSON.stringify(profile));

      toast.success("🎉 注册成功！欢迎加入兔到到大家庭！", {
        description: "正在为您跳转到工作台..."
      });

      // 2秒后跳转
      setTimeout(() => {
        navigate('/workbench');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("注册失败", { description: "请重试" });
    } finally {
      setLoading(false);
    }
  };

  // 判断表单是否有效
  const formValid = formData.full_name && 
                     formData.id_card_number.length === 18 && 
                     idCardValid !== false &&
                     formData.gender && 
                     formData.birth_year;

  // 生成年份选项 (18-70岁)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 53 }, (_, i) => currentYear - 18 - i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        
        <Card>
          <CardHeader className="text-center pb-4">
            {/* 标题优化 */}
            <CardTitle className="text-2xl font-bold">
              还差一步，即可完成注册！
            </CardTitle>
            
            {/* 进度条 */}
            <div className="mt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div className="flex-1 h-1 bg-primary max-w-[100px]"></div>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  1
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                完成度 100%
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 必填信息区 */}
            <div className="p-5 bg-primary/5 border-2 border-primary/30 rounded-xl space-y-4">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-primary text-primary-foreground">
                  必填信息
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  仅需1分钟
                </span>
              </div>
              
              {/* 真实姓名 */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">真实姓名</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="请输入您的真实姓名"
                  className="h-12 text-base"
                />
              </div>
              
              {/* 身份证号码 */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">身份证号码</Label>
                <div className="relative">
                  <Input
                    value={formData.id_card_number}
                    onChange={(e) => handleIdCardChange(e.target.value)}
                    placeholder="请输入身份证号码"
                    maxLength={18}
                    className="h-12 text-base pr-10"
                  />
                  {idCardValid === true && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                  {idCardValid === false && (
                    <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                  )}
                </div>
                {idCardValid === false && (
                  <p className="text-xs text-destructive">身份证号格式错误，请检查</p>
                )}
              </div>
              
              {/* 性别和出生年份 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">性别</Label>
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant={formData.gender === '男' ? 'default' : 'outline'}
                      className="flex-1 h-12"
                      onClick={() => setFormData({ ...formData, gender: '男' })}
                    >
                      <span className="mr-1">👨</span> 男
                    </Button>
                    <Button 
                      type="button"
                      variant={formData.gender === '女' ? 'default' : 'outline'}
                      className="flex-1 h-12"
                      onClick={() => setFormData({ ...formData, gender: '女' })}
                    >
                      <span className="mr-1">👩</span> 女
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base font-semibold">出生年份</Label>
                  <Select value={formData.birth_year} onValueChange={(value) => setFormData({ ...formData, birth_year: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="选择" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}年
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* 可选上传区 - 折叠面板 */}
            <details className="group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between p-4 border border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      可选
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      身份证照片上传（提前上传可加快审核）
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" />
                </div>
              </summary>
              
              <div className="mt-3 p-4 border border-dashed rounded-lg space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">身份证正面</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdCardFront(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">身份证背面</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdCardBack(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </details>
            
            {/* 按钮区 */}
            <div className="space-y-3 pt-4">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
                onClick={handleSubmit}
                disabled={!formValid || loading}
              >
                {loading ? "提交中..." : "完成注册"}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                *更详细的资料可在后续"个人中心"随时完善
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickRegister;
