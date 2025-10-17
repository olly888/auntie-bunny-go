import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Clock, BookOpen, Award, Play, Check, ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Skill {
  id: string;
  name: string;
  level: string;
  certified: boolean;
  certDate?: string;
  courseId?: number;
  description: string;
}

const SkillsTraining = () => {
  const navigate = useNavigate();
  const [courseProgresses, setCourseProgresses] = useState<Record<number, number>>({});
  const [certCount, setCertCount] = useState(0);
  
  const courses = [
    {
      id: 0,
      title: "新手任务：快速上岗指南",
      type: "required",
      duration: "20分钟",
      description: "专为新人设计的快速上岗课程，完成后即可开始接单",
      skillId: "onboarding",
      isNewbie: true
    },
    {
      id: 1,
      title: "服务礼仪与沟通技巧",
      type: "required",
      duration: "45分钟",
      description: "学习专业的服务礼仪，提升与客户的沟通效果",
      skillId: "communication"
    },
    {
      id: 2,
      title: "家庭清洁标准流程",
      type: "required", 
      duration: "60分钟",
      description: "掌握标准清洁流程，确保服务质量达标",
      skillId: "home_cleaning"
    },
    {
      id: 3,
      title: "安全作业规范",
      type: "required",
      duration: "30分钟", 
      description: "了解作业安全要求，保护自身和客户安全",
      skillId: "safety"
    },
    {
      id: 4,
      title: "高效时间管理",
      type: "optional",
      duration: "25分钟",
      description: "提升工作效率，合理安排服务时间",
      skillId: "time_management"
    },
    {
      id: 5,
      title: "客户投诉处理技巧", 
      type: "optional",
      duration: "35分钟",
      description: "学会妥善处理客户投诉，化解矛盾冲突",
      skillId: "complaint_handling"
    }
  ];

  const skills: Skill[] = [
    {
      id: "onboarding",
      name: "新手上岗",
      level: "必修",
      certified: false,
      courseId: 0,
      description: "新人必修课程认证"
    },
    {
      id: "home_cleaning",
      name: "家居清洁",
      level: "高级",
      certified: true,
      certDate: "2024-01-15",
      courseId: 2,
      description: "专业家居清洁服务技能"
    },
    {
      id: "communication",
      name: "服务礼仪",
      level: "中级",
      certified: true,
      certDate: "2024-02-20",
      courseId: 1,
      description: "优质服务礼仪与沟通能力"
    },
    {
      id: "safety",
      name: "安全作业",
      level: "初级",
      certified: true,
      certDate: "2024-03-10",
      courseId: 3,
      description: "安全作业规范认证"
    },
    {
      id: "time_management",
      name: "时间管理",
      level: "未认证",
      certified: false,
      courseId: 4,
      description: "高效时间管理技能"
    },
    {
      id: "complaint_handling",
      name: "投诉处理",
      level: "未认证",
      certified: false,
      courseId: 5,
      description: "客户投诉处理技巧"
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
    
    // Count certifications
    const count = skills.filter(s => s.certified).length;
    setCertCount(count);
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
    navigate(`/skills-training/course/${courseId}`);
  };

  const handleApplyCertification = (skill: Skill) => {
    if (skill.courseId) {
      const progress = courseProgresses[skill.courseId] || 0;
      if (progress === 100) {
        // Go to certification test
        navigate(`/skills-training/test/${skill.id}`);
      } else {
        // Go to course learning
        navigate(`/skills-training/course/${skill.courseId}`);
      }
    }
  };

  const allCoursesCompleted = courses.every(course => (courseProgresses[course.id] || 0) === 100);

  const getButtonText = (courseId: number) => {
    const progress = courseProgresses[courseId] || 0;
    if (progress === 0) return "开始";
    if (progress === 100) return "复习";
    return "继续";
  };

  const getLevelColor = (level: string) => {
    const colorMap: { [key: string]: string } = {
      '高级': 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
      '中级': 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
      '初级': 'text-green-600 bg-green-50 dark:bg-green-950/30',
      '未认证': 'text-muted-foreground bg-muted'
    };
    return colorMap[level] || 'text-muted-foreground bg-muted';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/profile')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">技能培训</h1>
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
                已完成 {completedCourses}/{totalCourses} 门课程 • 已获得 {certCount} 个认证
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">总体进度</span>
              <span className="font-semibold text-primary">{overallPercentage}%</span>
            </div>
            <Progress value={overallPercentage} className="h-2" />
          </div>
        </Card>

        {/* 认证流程说明 */}
        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-accent-foreground mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">认证流程</h3>
              <p className="text-sm text-muted-foreground">
                完成对应课程 → 通过认证测试 → 获得技能认证标签
              </p>
            </div>
          </div>
        </Card>

        {/* Tab切换 */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">培训课程</TabsTrigger>
            <TabsTrigger value="certifications">
              我的认证
              {certCount > 0 && (
                <Badge className="ml-2 px-1.5 py-0 text-xs h-5 min-w-5">{certCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {/* 培训课程Tab */}
          <TabsContent value="courses" className="mt-6 space-y-4">
            {courses.map((course) => {
              const progress = courseProgresses[course.id] || 0;
              const isCompleted = progress === 100;
              
              return (
                <Card key={course.id} className="p-4 bg-gradient-card">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mt-1 shrink-0",
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
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                          variant={isCompleted ? "secondary" : "default"}
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
          </TabsContent>

          {/* 我的认证Tab */}
          <TabsContent value="certifications" className="mt-6 space-y-4">
            {skills.map((skill) => (
              <Card key={skill.id} className="p-4 bg-gradient-card">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mt-1 shrink-0",
                    skill.certified 
                      ? "bg-success/10 text-success" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {skill.certified ? (
                      <Award className="w-5 h-5" />
                    ) : (
                      <Shield className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-medium text-foreground">{skill.name}</h3>
                      <Badge className={cn("text-xs px-2 py-0", getLevelColor(skill.level))}>
                        {skill.level}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {skill.description}
                    </p>
                    
                    {skill.certified && skill.certDate ? (
                      <div className="text-xs text-muted-foreground">
                        认证时间：{skill.certDate}
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs px-3 py-1 mt-2"
                        onClick={() => handleApplyCertification(skill)}
                      >
                        {skill.courseId && (courseProgresses[skill.courseId] || 0) === 100 
                          ? "参加认证测试" 
                          : "开始学习课程"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default SkillsTraining;
