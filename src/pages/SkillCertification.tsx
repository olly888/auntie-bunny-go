import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SkillCertification = () => {
  const navigate = useNavigate();

  // 模拟技能数据
  const skills = [
    {
      id: 1,
      name: "家居清洁",
      level: "高级",
      levelColor: "text-amber-600 bg-amber-100",
      certified: true,
      certifiedDate: "2024-01-15",
      icon: "🏠"
    },
    {
      id: 2,
      name: "厨房深清",
      level: "中级",
      levelColor: "text-blue-600 bg-blue-100",
      certified: true,
      certifiedDate: "2024-02-20",
      icon: "🍳"
    },
    {
      id: 3,
      name: "老人护理",
      level: "初级",
      levelColor: "text-green-600 bg-green-100",
      certified: true,
      certifiedDate: "2024-03-10",
      icon: "👴"
    },
    {
      id: 4,
      name: "收纳整理",
      level: "未认证",
      levelColor: "text-gray-600 bg-gray-100",
      certified: false,
      certifiedDate: null,
      icon: "📦"
    },
    {
      id: 5,
      name: "宠物护理",
      level: "未认证",
      levelColor: "text-gray-600 bg-gray-100",
      certified: false,
      certifiedDate: null,
      icon: "🐕"
    }
  ];

  const handleApplyCertification = (skillId: number) => {
    // 实际项目中跳转到认证申请流程
    console.log("Apply for certification:", skillId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">技能认证</h1>
          <div className="w-9" />
        </div>

        <div className="p-4 space-y-6">
          {/* 认证说明 */}
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-foreground mb-1">提升技能，获得更多订单</p>
                  <p className="text-muted-foreground text-xs">
                    完成技能认证后，您将优先获得对应类型的订单推荐
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 技能列表 */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">我的技能</h2>
            
            {skills.map((skill) => (
              <Card key={skill.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-3xl">{skill.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{skill.name}</h3>
                          {skill.certified ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={skill.levelColor}>
                            {skill.level}
                          </Badge>
                          {skill.certified && skill.certifiedDate && (
                            <span className="text-xs text-muted-foreground">
                              认证于 {skill.certifiedDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {!skill.certified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplyCertification(skill.id)}
                      >
                        申请认证
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 底部提示 */}
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center text-sm text-muted-foreground">
              <p>技能认证需要通过线下培训和考核</p>
              <p className="mt-1">详情请咨询平台客服</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkillCertification;
