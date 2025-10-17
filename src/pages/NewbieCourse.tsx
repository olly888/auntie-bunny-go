import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Check, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const NewbieCourse = () => {
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const lessons = [
    { 
      id: 1, 
      title: "欢迎加入兔到到", 
      duration: "2分钟",
      content: "了解兔到到平台的服务理念和您的工作价值"
    },
    { 
      id: 2, 
      title: "平台规则与服务标准", 
      duration: "5分钟",
      content: "掌握平台基本规则，确保服务质量达标"
    },
    { 
      id: 3, 
      title: "安全作业规范", 
      duration: "5分钟",
      content: "学习安全作业要求，保护自身和客户安全"
    },
    { 
      id: 4, 
      title: "接单与服务流程", 
      duration: "8分钟",
      content: "熟悉从接单到完成服务的完整流程"
    }
  ];

  const progress = (completedLessons.length / lessons.length) * 100;
  const allCompleted = completedLessons.length === lessons.length;

  const handleLessonClick = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const handleComplete = () => {
    // 标记课程完成
    localStorage.setItem('course_0_progress', '100');
    // 跳转到考核页面
    navigate('/certification-test?type=onboarding');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/skills-training')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">新手任务</h1>
            <p className="text-sm text-muted-foreground">快速上岗指南</p>
          </div>
        </div>

        {/* 课程进度 */}
        <Card className="p-6 bg-gradient-card border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">学习进度</h2>
              <p className="text-sm text-muted-foreground">
                已完成 {completedLessons.length}/{lessons.length} 节课程
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">总体进度</span>
              <span className="font-semibold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>

        {/* 课程说明 */}
        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <Badge variant="default" className="mt-0.5">必修课程</Badge>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                完成全部课程学习后，您将参加简单的认证测试。通过后即可正式开始接单！
              </p>
            </div>
          </div>
        </Card>

        {/* 课程列表 */}
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            
            return (
              <Card 
                key={lesson.id} 
                className={cn(
                  "p-4 bg-gradient-card cursor-pointer transition-all hover:shadow-md",
                  isCompleted && "border-success/50"
                )}
                onClick={() => handleLessonClick(lesson.id)}
              >
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
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{lesson.title}</h3>
                      {isCompleted && (
                        <Badge variant="outline" className="text-xs border-success text-success">
                          已完成
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {lesson.content}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>⏱️ {lesson.duration}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 开始考核按钮 */}
        <Button 
          onClick={handleComplete}
          disabled={!allCompleted}
          className="w-full h-12 text-base"
        >
          {allCompleted ? "🎓 开始考核" : `还需完成 ${lessons.length - completedLessons.length} 节课程`}
        </Button>

        {allCompleted && (
          <p className="text-xs text-center text-muted-foreground">
            点击后将进入认证测试，共5道题，答对4题以上即可通过
          </p>
        )}
      </div>
    </div>
  );
};

export default NewbieCourse;
