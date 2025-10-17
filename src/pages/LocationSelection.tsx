import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const LocationSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [city, setCity] = useState("深圳市");
  const [community, setCommunity] = useState("南山大冲社区");

  const handleJoin = () => {
    const user = JSON.parse(localStorage.getItem("mock_user") || "{}");

    // 创建基础 profile（状态为 pending）
    const profile = {
      id: user.id,
      phone: user.phone,
      intended_city: city,
      intended_community: community,
      onboarding_status: "pending", // 待激活状态
      is_id_verified: false,
      is_training_completed: false,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem("mock_user_profile", JSON.stringify(profile));

    toast({
      title: "欢迎加入兔到到！",
      description: "正在为您准备工作台...",
    });

    setTimeout(() => navigate("/workbench"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-background">
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            欢迎加入兔到到！
          </h1>
          <p className="text-lg text-muted-foreground">
            选择您的服务意向区域，让我们为您推荐最适合的订单
          </p>
        </div>

        {/* City Selection */}
        <Card className="mb-6 shadow-md">
          <CardContent className="p-6">
            <Label className="text-base font-semibold mb-3 block">
              意向服务城市
            </Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-14 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="深圳市">深圳市</SelectItem>
                <SelectItem value="广州市" disabled className="text-muted-foreground">
                  广州市（即将开通）
                </SelectItem>
                <SelectItem value="北京市" disabled className="text-muted-foreground">
                  北京市（即将开通）
                </SelectItem>
                <SelectItem value="上海市" disabled className="text-muted-foreground">
                  上海市（即将开通）
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Community Selection */}
        <Card className="mb-8 shadow-md">
          <CardContent className="p-6">
            <Label className="text-base font-semibold mb-3 block">
              意向服务社区
            </Label>
            <Select value={community} onValueChange={setCommunity}>
              <SelectTrigger className="h-14 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="南山大冲社区">南山大冲社区</SelectItem>
                <SelectItem value="福田上梅林社区" disabled className="text-muted-foreground">
                  福田上梅林社区（即将开通）
                </SelectItem>
                <SelectItem value="罗湖东门社区" disabled className="text-muted-foreground">
                  罗湖东门社区（即将开通）
                </SelectItem>
              </SelectContent>
            </Select>
            
            {/* 添加提示信息 */}
            <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
              <span>💡</span>
              <span>更多区域正在火热开通中，敬请期待！</span>
            </p>
          </CardContent>
        </Card>

        {/* Join Button */}
        <Button
          className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          onClick={handleJoin}
          disabled={!city || !community}
        >
          立即加入 🎉
        </Button>
      </div>
    </div>
  );
};

export default LocationSelection;
