import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { Clock, BookOpen, Award, Bell, Play, Check } from "lucide-react";

const TrainingCenter = () => {
  // 模拟数据
  const learningProgress = {
    completed: 12,
    total: 18,
    percentage: 67,
    nextDeadline: "2024-01-15"
  };

  const courses = [
    {
      id: 1,
      title: "服务礼仪与沟通技巧",
      type: "required",
      duration: "45分钟",
      completed: true,
      description: "学习专业的服务礼仪，提升与客户的沟通效果",
      progress: 100
    },
    {
      id: 2,
      title: "家庭清洁标准流程",
      type: "required", 
      duration: "60分钟",
      completed: false,
      description: "掌握标准清洁流程，确保服务质量达标",
      progress: 30
    },
    {
      id: 3,
      title: "安全作业规范",
      type: "required",
      duration: "30分钟", 
      completed: false,
      description: "了解作业安全要求，保护自身和客户安全",
      progress: 0
    },
    {
      id: 4,
      title: "高效时间管理",
      type: "optional",
      duration: "25分钟",
      completed: true,
      description: "提升工作效率，合理安排服务时间",
      progress: 100
    },
    {
      id: 5,
      title: "客户投诉处理技巧", 
      type: "optional",
      duration: "35分钟",
      completed: false,
      description: "学会妥善处理客户投诉，化解矛盾冲突",
      progress: 0
    }
  ];

  const getTypeColor = (type: string) => {
    return type === 'required' ? 'destructive' : 'secondary';
  };

  const getTypeText = (type: string) => {
    return type === 'required' ? '必修' : '选修';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        <PageHeader 
          title="培训中心"
          subtitle="提升技能，成为更专业的服务者"
          className="text-center"
        />

        {/* 学习进度总览 */}
        <Card className="p-6 bg-gradient-card border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">学习进度</h2>
              <p className="text-sm text-muted-foreground">
                已完成 {learningProgress.completed}/{learningProgress.total} 门课程
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">总体进度</span>
              <span className="font-semibold text-primary">{learningProgress.percentage}%</span>
            </div>
            <Progress value={learningProgress.percentage} className="h-2" />
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>继续努力，距离认证还差 {learningProgress.total - learningProgress.completed} 门课程</span>
            </div>
          </div>
        </Card>

        {/* 学习提醒 */}
        <Card className="p-4 bg-warning/5 border-warning/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-warning-foreground">学习提醒</p>
              <p className="text-xs text-muted-foreground">
                必修课程需在 {learningProgress.nextDeadline} 前完成
              </p>
            </div>
          </div>
        </Card>

        {/* 课程列表 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">课程列表</h2>
          
          <div className="space-y-4">
            {courses.map((course) => (
              <Card key={course.id} className="p-4 bg-gradient-card">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mt-1",
                    course.completed 
                      ? "bg-success/10 text-success" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {course.completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{course.title}</h3>
                      <Badge 
                        variant={getTypeColor(course.type)} 
                        className="text-xs px-2 py-0"
                      >
                        {getTypeText(course.type)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                        {course.progress > 0 && course.progress < 100 && (
                          <>
                            <span>•</span>
                            <span>已学习 {course.progress}%</span>
                          </>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant={course.completed ? "secondary" : "primary"}
                        className="text-xs px-3 py-1"
                      >
                        {course.completed ? "复习" : course.progress > 0 ? "继续" : "开始"}
                      </Button>
                    </div>
                    
                    {/* 课程进度条 */}
                    {course.progress > 0 && course.progress < 100 && (
                      <div className="mt-3">
                        <Progress value={course.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 认证信息 */}
        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-accent-foreground">服务认证</p>
              <p className="text-xs text-muted-foreground">
                完成所有必修课程后可获得专业服务认证
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              了解详情
            </Button>
          </div>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default TrainingCenter;