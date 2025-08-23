import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, CheckCircle } from "lucide-react";

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  // 模拟课程数据
  const courseData = {
    1: {
      title: "服务礼仪与沟通技巧",
      duration: "45分钟",
      sections: [
        { title: "服务礼仪基础", duration: "10分钟", content: "学习基本的服务礼仪规范..." },
        { title: "沟通技巧实践", duration: "15分钟", content: "掌握有效的沟通方法..." },
        { title: "案例分析", duration: "20分钟", content: "通过实际案例学习应用..." }
      ]
    },
    2: {
      title: "家庭清洁标准流程",
      duration: "60分钟", 
      sections: [
        { title: "清洁工具认知", duration: "15分钟", content: "了解各种清洁工具的使用..." },
        { title: "标准清洁流程", duration: "30分钟", content: "学习标准化的清洁步骤..." },
        { title: "质量检查标准", duration: "15分钟", content: "掌握服务质量检查要点..." }
      ]
    },
    3: {
      title: "安全作业规范",
      duration: "30分钟",
      sections: [
        { title: "安全风险识别", duration: "10分钟", content: "识别常见的安全风险..." },
        { title: "防护措施", duration: "15分钟", content: "学习正确的防护方法..." },
        { title: "应急处理", duration: "5分钟", content: "掌握应急处理流程..." }
      ]
    },
    4: {
      title: "高效时间管理", 
      duration: "25分钟",
      sections: [
        { title: "时间规划原则", duration: "10分钟", content: "学习时间管理的基本原则..." },
        { title: "工作效率提升", duration: "15分钟", content: "掌握提升工作效率的方法..." }
      ]
    },
    5: {
      title: "客户投诉处理技巧",
      duration: "35分钟", 
      sections: [
        { title: "投诉原因分析", duration: "10分钟", content: "了解常见投诉原因..." },
        { title: "沟通处理技巧", duration: "20分钟", content: "学习有效的投诉处理方法..." },
        { title: "预防措施", duration: "5分钟", content: "掌握投诉预防策略..." }
      ]
    }
  };

  const course = courseData[Number(courseId) as keyof typeof courseData];

  useEffect(() => {
    // 从 localStorage 读取学习进度
    const savedProgress = localStorage.getItem(`course_${courseId}_progress`);
    if (savedProgress) {
      setProgress(parseFloat(savedProgress));
    }
  }, [courseId]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // 模拟播放进度
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            setIsPlaying(false);
            localStorage.setItem(`course_${courseId}_progress`, "100");
            localStorage.setItem(`course_${courseId}_completed`, "true");
            return 100;
          }
          localStorage.setItem(`course_${courseId}_progress`, newProgress.toString());
          return newProgress;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  };

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    setProgress((sectionIndex / course.sections.length) * 100);
  };

  const handleComplete = () => {
    localStorage.setItem(`course_${courseId}_progress`, "100");
    localStorage.setItem(`course_${courseId}_completed`, "true");
    navigate('/training');
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">课程不存在</p>
          <Button onClick={() => navigate('/training')} className="mt-4">
            返回培训中心
          </Button>
        </div>
      </div>
    );
  }

  const currentSectionData = course.sections[currentSection];
  const isCompleted = progress >= 100;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        
        {/* 头部导航 */}
        <div className="flex items-center gap-4 p-4 border-b bg-card">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/training')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground truncate">{course.title}</h1>
            <p className="text-sm text-muted-foreground">{course.duration}</p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="p-4 bg-card border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">学习进度</span>
            <span className="text-sm font-medium text-foreground">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* 视频播放区域 */}
        <div className="aspect-video bg-muted relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">模拟视频播放区域</p>
            </div>
          </div>
        </div>

        {/* 播放控制 */}
        <div className="p-4 bg-card border-b">
          <div className="flex items-center justify-center gap-6">
            <Button variant="ghost" size="sm" disabled={currentSection === 0}>
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button 
              size="sm" 
              onClick={handlePlayPause}
              disabled={isCompleted}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={currentSection === course.sections.length - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 课程内容 */}
        <div className="p-4 space-y-4">
          
          {/* 当前章节 */}
          <Card className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {currentSection + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{currentSectionData.title}</h3>
                <p className="text-sm text-muted-foreground">{currentSectionData.duration}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentSectionData.content}
            </p>
          </Card>

          {/* 章节列表 */}
          <div>
            <h3 className="font-medium text-foreground mb-3">课程章节</h3>
            <div className="space-y-2">
              {course.sections.map((section, index) => (
                <Button
                  key={index}
                  variant={index === currentSection ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleSectionChange(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      index <= currentSection ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {index < currentSection || (index === currentSection && isCompleted) ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-muted-foreground">{section.duration}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* 完成按钮 */}
          {isCompleted && (
            <Card className="p-4 bg-success/5 border-success/20">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="font-medium text-success-foreground mb-2">🎉 课程学习完成！</p>
                <p className="text-sm text-muted-foreground mb-4">
                  您已成功完成本课程的学习，知识点已掌握。
                </p>
                <Button onClick={handleComplete} className="w-full">
                  返回培训中心
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;