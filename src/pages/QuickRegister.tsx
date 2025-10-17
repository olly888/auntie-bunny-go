import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

const QuickRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [idCardValid, setIdCardValid] = useState<boolean | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    id_card_number: "",
    gender: "",
    age: ""
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

  // 验证年龄
  const validateAge = (value: string) => {
    const age = parseInt(value);
    if (value && (isNaN(age) || age < 18 || age > 70)) {
      setAgeError("年龄必须在18-70岁之间");
      return false;
    } else {
      setAgeError(null);
      return true;
    }
  };

  const handleIdCardChange = (value: string) => {
    setFormData({ ...formData, id_card_number: value });
    validateIdCard(value);
  };

  const handleAgeChange = (value: string) => {
    setFormData({ ...formData, age: value });
    validateAge(value);
  };

  const handleSubmit = async () => {
    // 验证必填字段
    if (!formData.full_name || !formData.id_card_number || !formData.gender || !formData.age) {
      toast.error("请填写完整信息", {
        description: "所有字段均为必填项"
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

    // 验证年龄
    if (!validateAge(formData.age)) {
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      localStorage.setItem("mock_user_profile", JSON.stringify(profile));

      toast.success("🎉 注册成功！", {
        description: "欢迎加入兔到到大家庭！正在跳转..."
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
                     formData.age && 
                     !ageError;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/auth')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回登录页
        </Button>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              还差一步，即可开始赚钱！
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 真实姓名 */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">真实姓名</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="请输入您的真实姓名"
                className="h-12"
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
                  className="h-12 pr-10"
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
              
            {/* 性别和年龄 */}
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
                <Label className="text-base font-semibold">年龄</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  placeholder="请输入年龄"
                  min={18}
                  max={70}
                  className="h-12"
                />
                {ageError && (
                  <p className="text-xs text-destructive mt-1">{ageError}</p>
                )}
              </div>
            </div>
            
            {/* 提交按钮 */}
            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 mt-6"
              onClick={handleSubmit}
              disabled={!formValid || loading}
            >
              {loading ? "注册中..." : "开始赚钱 💰"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickRegister;
