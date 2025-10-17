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
  const [city, setCity] = useState("");
  const [community, setCommunity] = useState("");

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
                <SelectValue placeholder="请选择城市" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="深圳市">深圳市</SelectItem>
                <SelectItem value="广州市">广州市</SelectItem>
                <SelectItem value="北京市">北京市</SelectItem>
                <SelectItem value="上海市">上海市</SelectItem>
                <SelectItem value="杭州市">杭州市</SelectItem>
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
            <Select value={community} onValueChange={setCommunity} disabled={!city}>
              <SelectTrigger className="h-14 text-lg">
                <SelectValue placeholder="请选择社区" />
              </SelectTrigger>
              <SelectContent>
                {city === "深圳市" && (
                  <>
                    <SelectItem value="南山区大冲社区">南山区大冲社区</SelectItem>
                    <SelectItem value="福田区上梅林社区">福田区上梅林社区</SelectItem>
                    <SelectItem value="罗湖区东门社区">罗湖区东门社区</SelectItem>
                  </>
                )}
                {city === "广州市" && (
                  <>
                    <SelectItem value="天河区珠江新城">天河区珠江新城</SelectItem>
                    <SelectItem value="海珠区赤岗">海珠区赤岗</SelectItem>
                  </>
                )}
                {city === "北京市" && (
                  <>
                    <SelectItem value="朝阳区国贸">朝阳区国贸</SelectItem>
                    <SelectItem value="海淀区中关村">海淀区中关村</SelectItem>
                  </>
                )}
                {(city === "上海市" || city === "杭州市") && (
                  <SelectItem value={`${city}市中心`}>{city}市中心</SelectItem>
                )}
              </SelectContent>
            </Select>
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
