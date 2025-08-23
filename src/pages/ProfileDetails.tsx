import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { ArrowLeft, Camera, User, Shield } from "lucide-react";
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
    avatar: ""
  });

  const handleSave = () => {
    // Here you would save to backend/localStorage
    toast({
      title: "保存成功",
      description: "个人资料已更新",
    });
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

        <Button onClick={handleSave} className="w-full">
          保存设置
        </Button>
      </div>
    </div>
  );
};

export default ProfileDetails;