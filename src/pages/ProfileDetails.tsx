import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { ArrowLeft, Camera, User, Shield, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isOnline, setIsOnline } = useOnlineStatus();
  
  const [profile, setProfile] = useState({
    name: "李阿姨",
    phone: "138****5678",
    employeeId: "TDD001234",
    gender: "女",
    birthday: "1985-06-15",
    avatar: "",
    skills: ["家政清洁", "母婴护理", "老人陪护"],
    serviceAreas: ["朝阳区", "海淀区"],
    workingHours: "08:00-18:00",
    emergencyOrders: true,
    autoOnline: true
  });

  const [selectedSkills, setSelectedSkills] = useState(profile.skills);
  
  const skillOptions = [
    "家政清洁", "母婴护理", "老人陪护", "烹饪料理", 
    "宠物照看", "搬家整理", "园艺绿植", "家电维修"
  ];

  const handleSave = () => {
    // Here you would save to backend/localStorage
    toast({
      title: "保存成功",
      description: "个人资料已更新",
    });
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setSelectedSkills([...selectedSkills, skill]);
    } else {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card shadow-card p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">个人资料</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                    李
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>姓名</Label>
                <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
              </div>
              <div>
                <Label>手机号</Label>
                <Input value={profile.phone} disabled />
              </div>
              <div>
                <Label>工号</Label>
                <Input value={profile.employeeId} disabled />
              </div>
              <div>
                <Label>性别</Label>
                <Select value={profile.gender}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="女">女</SelectItem>
                    <SelectItem value="男">男</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              服务信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">服务技能</Label>
              <div className="grid grid-cols-2 gap-2">
                {skillOptions.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                    />
                    <Label className="text-sm">{skill}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>服务区域</Label>
              <div className="flex gap-2 flex-wrap mt-1">
                {profile.serviceAreas.map((area) => (
                  <Badge key={area} variant="secondary">{area}</Badge>
                ))}
                <Button variant="outline" size="sm">添加区域</Button>
              </div>
            </div>
            
            <div>
              <Label>工作时间</Label>
              <Input value={profile.workingHours} />
            </div>
          </CardContent>
        </Card>

        {/* Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              资质认证
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">身份证认证</span>
              <Badge variant="default">已认证</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">健康证</span>
              <Badge variant="default">已认证</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">从业资格证</span>
              <Badge variant="secondary">待上传</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              可用性设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">接收紧急订单</p>
                <p className="text-xs text-muted-foreground">24小时内的紧急预约</p>
              </div>
              <Switch checked={profile.emergencyOrders} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">默认上线状态</p>
                <p className="text-xs text-muted-foreground">登录时自动上线接单</p>
              </div>
              <Switch checked={profile.autoOnline} />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">当前在线状态</p>
                <p className="text-xs text-muted-foreground">
                  {isOnline ? "正在接单中" : "已下线休息"}
                </p>
              </div>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          保存设置
        </Button>
      </div>
    </div>
  );
};

export default ProfileDetails;