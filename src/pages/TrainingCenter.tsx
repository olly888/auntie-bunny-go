import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { cn } from "@/lib/utils";
import { Clock, BookOpen, Award, Play, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrainingCenter = () => {
  const navigate = useNavigate();
  const [courseProgresses, setCourseProgresses] = useState<Record<number, number>>({});
  
  const courses = [
    {
      id: 1,
      title: "服务礼仪与沟通技巧",
      type: "required",
      duration: "45分钟",
      description: "学习专业的服务礼仪，提升与客户的沟通效果"
    },
    {
      id: 2,
      title: "家庭清洁标准流程",
      type: "required", 
      duration: "60分钟",
      description: "掌握标准清洁流程，确保服务质量达标"
    },
    {
      id: 3,
      title: "安全作业规范",
      type: "required",
      duration: "30分钟", 
      description: "了解作业安全要求，保护自身和客户安全"
    },
    {
      id: 4,
      title: "高效时间管理",
      type: "optional",
      duration: "25分钟",
      description: "提升工作效率，合理安排服务时间"
    },
    {
      id: 5,
      title: "客户投诉处理技巧", 
      type: "optional",
      duration: "35分钟",
      description: "学会妥善处理客户投诉，化解矛盾冲突"
    }
  ];

  // Load course progress from localStorage
  useEffect(() => {
    const progresses: Record<number, number> = {};
    courses.forEach(course => {
      const saved = localStorage.getItem(`course_${course.id}_progress`);
      progresses[course.id] = saved ? parseInt(saved) : 0;
    });
    setCourseProgresses(progresses);
  }, []);

  // Calculate learning progress
  const completedCourses = Object.values(courseProgresses).filter(progress => progress === 100).length;
  const totalCourses = courses.length;
  const overallPercentage = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  const getTypeColor = (type: string) => {
    return type === 'required' ? 'destructive' : 'secondary';
  };

  const getTypeText = (type: string) => {
    return type === 'required' ? '必修' : '选修';
  };

  const handleCourseAction = (courseId: number) => {
    navigate(`/training/course/${courseId}`);
  };

  const allCoursesCompleted = courses.every(course => (courseProgresses[course.id] || 0) === 100);

  const getButtonText = (courseId: number) => {
    const progress = courseProgresses[courseId] || 0;
    if (progress === 0) return "开始";
    if (progress === 100) return "复习";
    return "继续";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">培训中心</h1>
        </div>

        {/* 学习进度总览 */}
        <Card className="p-6 bg-gradient-card border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">学习进度</h2>
              <p className="text-sm text-muted-foreground">
                已完成 {completedCourses}/{totalCourses} 门课程
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">总体进度</span>
              <span className="font-semibold text-primary">{overallPercentage}%</span>
            </div>
            <Progress value={overallPercentage} className="h-2" />
            
            {!allCoursesCompleted && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="w-4 h-4" />
                <span>继续努力，距离认证还差 {totalCourses - completedCourses} 门课程</span>
              </div>
            )}
          </div>
        </Card>

        {/* 课程列表 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">课程列表</h2>
          
          <div className="space-y-4">
            {courses.map((course) => {
              const progress = courseProgresses[course.id] || 0;
              const isCompleted = progress === 100;
              
              return (
                <Card key={course.id} className="p-4 bg-gradient-card">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mt-1",
                      isCompleted 
                        ? "bg-success/10 text-success" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? (
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
                          {progress > 0 && progress < 100 && (
                            <>
                              <span>•</span>
                              <span>已学习 {progress}%</span>
                            </>
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant={isCompleted ? "secondary" : "primary"}
                          className="text-xs px-3 py-1"
                          onClick={() => handleCourseAction(course.id)}
                        >
                          {getButtonText(course.id)}
                        </Button>
                      </div>
                      
                      {/* 课程进度条 */}
                      {progress > 0 && progress < 100 && (
                        <div className="mt-3">
                          <Progress value={progress} className="h-1" />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 认证信息 */}
        <Card className={cn(
          "p-4",
          allCoursesCompleted 
            ? "bg-success/5 border-success/20" 
            : "bg-accent/5 border-accent/20"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              allCoursesCompleted 
                ? "bg-success/10" 
                : "bg-accent/10"
            )}>
              <Award className={cn(
                "w-4 h-4",
                allCoursesCompleted 
                  ? "text-success" 
                  : "text-accent-foreground"
              )} />
            </div>
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium",
                allCoursesCompleted 
                  ? "text-success-foreground" 
                  : "text-accent-foreground"
              )}>
                {allCoursesCompleted ? "🎉 恭喜！服务认证已完成" : "服务认证"}
              </p>
              <p className="text-xs text-muted-foreground">
                {allCoursesCompleted 
                  ? "您已通过专业服务认证，可以提供更优质的服务" 
                  : "完成所有必修课程后可获得专业服务认证"
                }
              </p>
            </div>
            {!allCoursesCompleted && (
              <Button variant="outline" size="sm" className="text-xs">
                了解详情
              </Button>
            )}
          </div>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default TrainingCenter;