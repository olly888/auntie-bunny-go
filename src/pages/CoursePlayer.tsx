import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, CheckCircle, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [hasReadMaterial, setHasReadMaterial] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // 课程数据
  const courseData = {
    1: {
      title: "服务礼仪与沟通技巧",
      duration: "45分钟",
      material: {
        title: "服务礼仪与沟通技巧要点",
        content: [
          "• 服务态度：保持微笑、热情、耐心的服务态度",
          "• 着装规范：穿着整洁、得体的工作服装",
          "• 言语沟通：使用礼貌用语，语调温和友善",
          "• 身体语言：保持良好的姿态和眼神交流",
          "• 倾听技巧：认真倾听客户需求，及时回应",
          "• 问题处理：遇到问题时保持冷静，积极寻找解决方案"
        ]
      },
      quiz: [
        {
          question: "在服务过程中，以下哪种态度最重要？",
          options: ["A. 快速完成", "B. 热情耐心", "C. 严格按流程", "D. 降低成本"],
          correct: "B"
        },
        {
          question: "与客户沟通时应该注意什么？",
          options: ["A. 大声说话", "B. 使用礼貌用语", "C. 避免眼神交流", "D. 快速结束对话"],
          correct: "B"
        },
        {
          question: "遇到客户投诉时，首先应该做什么？",
          options: ["A. 解释原因", "B. 推卸责任", "C. 认真倾听", "D. 立即离开"],
          correct: "C"
        }
      ]
    },
    2: {
      title: "家庭清洁标准流程",
      duration: "60分钟",
      material: {
        title: "家庭清洁标准操作流程",
        content: [
          "• 清洁前准备：检查清洁用具，了解客户特殊要求",
          "• 清洁顺序：从上到下，从里到外的清洁原则",
          "• 卫生间清洁：重点清洁马桶、洗手池、淋浴区",
          "• 厨房清洁：清洁灶台、油烟机、水池等重点区域",
          "• 客厅卧室：清洁家具表面、地面拖洗",
          "• 质量检查：完成后进行自检，确保清洁质量"
        ]
      },
      quiz: [
        {
          question: "家庭清洁的正确顺序是？",
          options: ["A. 从下到上", "B. 从上到下", "C. 随意顺序", "D. 从外到里"],
          correct: "B"
        },
        {
          question: "清洁前最重要的准备工作是？",
          options: ["A. 准备清洁工具", "B. 了解客户要求", "C. 两者都重要", "D. 都不重要"],
          correct: "C"
        }
      ]
    },
    3: {
      title: "安全作业规范",
      duration: "30分钟",
      material: {
        title: "安全作业操作规范",
        content: [
          "• 人身安全：使用防护手套，避免接触有害化学品",
          "• 用电安全：确保手部干燥后再触碰电器开关",
          "• 高处作业：使用稳固的梯子，有人陪护",
          "• 化学品使用：按说明使用清洁剂，保持通风",
          "• 紧急情况：记住客户联系方式和急救电话",
          "• 财物保护：爱护客户物品，如有损坏及时报告"
        ]
      },
      quiz: [
        {
          question: "使用清洁剂时最重要的安全措施是？",
          options: ["A. 戴防护手套", "B. 保持通风", "C. 按说明使用", "D. 以上都是"],
          correct: "D"
        },
        {
          question: "高处清洁时应该注意什么？",
          options: ["A. 动作要快", "B. 使用稳固梯子", "C. 独自完成", "D. 不需要防护"],
          correct: "B"
        }
      ]
    },
    4: {
      title: "高效时间管理",
      duration: "25分钟",
      material: {
        title: "服务时间管理技巧",
        content: [
          "• 时间规划：合理安排每项清洁任务的时间",
          "• 工具准备：提前准备好所需的清洁工具",
          "• 优先级管理：先完成重要和紧急的清洁任务",
          "• 效率提升：掌握快速有效的清洁技巧",
          "• 沟通技巧：与客户确认服务重点和时间安排",
          "• 应急处理：预留时间处理突发情况"
        ]
      },
      quiz: [
        {
          question: "时间管理中最重要的原则是？",
          options: ["A. 速度第一", "B. 质量第一", "C. 合理规划", "D. 节省成本"],
          correct: "C"
        },
        {
          question: "提高工作效率的关键是？",
          options: ["A. 熟练技巧", "B. 提前准备", "C. 合理安排", "D. 以上都是"],
          correct: "D"
        }
      ]
    },
    5: {
      title: "客户投诉处理技巧",
      duration: "35分钟",
      material: {
        title: "客户投诉处理要点",
        content: [
          "• 倾听原则：让客户充分表达不满，不要打断",
          "• 表示理解：对客户的感受表示理解和歉意",
          "• 问题分析：冷静分析投诉的具体原因",
          "• 解决方案：提出合理的解决方案",
          "• 跟进服务：确认客户满意度，防止再次发生",
          "• 上报机制：重大投诉及时上报平台处理"
        ]
      },
      quiz: [
        {
          question: "处理客户投诉的第一步是？",
          options: ["A. 解释原因", "B. 认真倾听", "C. 提供解决方案", "D. 寻求帮助"],
          correct: "B"
        },
        {
          question: "客户投诉时，正确的态度是？",
          options: ["A. 据理力争", "B. 推卸责任", "C. 表示理解", "D. 立即走人"],
          correct: "C"
        }
      ]
    }
  };

  const course = courseData[Number(courseId) as keyof typeof courseData];

  useEffect(() => {
    if (course) {
      const savedProgress = localStorage.getItem(`course_${courseId}_progress`);
      if (savedProgress) {
        const progressValue = parseInt(savedProgress);
        setProgress(progressValue);
        if (progressValue >= 50) setHasReadMaterial(true);
        if (progressValue === 100) setQuizCompleted(true);
      }
    }
  }, [courseId, course]);

  const handleMarkAsRead = () => {
    setHasReadMaterial(true);
    const newProgress = Math.max(progress, 50);
    setProgress(newProgress);
    localStorage.setItem(`course_${courseId}_progress`, newProgress.toString());
    toast({
      title: "阅读完成",
      description: "阅读材料已标记为完成",
    });
  };

  const handleQuizSubmit = () => {
    if (!course) return;
    
    let correctCount = 0;
    course.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / course.quiz.length) * 100);
    setQuizScore(score);

    if (score >= 60) {
      setQuizCompleted(true);
      localStorage.setItem(`course_${courseId}_progress`, "100");
      localStorage.setItem(`course_${courseId}_completed`, "true");
      setProgress(100);
      toast({
        title: "测验通过！",
        description: `您的得分是 ${score}分，课程已完成`,
      });
    } else {
      toast({
        title: "测验未通过",
        description: `您的得分是 ${score}分，需要60分以上才能通过`,
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
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
            <span className="text-sm font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* 课程内容 */}
        <div className="p-4">
          <Tabs defaultValue="material" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="material" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                阅读材料
              </TabsTrigger>
              <TabsTrigger value="quiz" disabled={!hasReadMaterial}>
                小测验
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="material" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">{course.material.title}</h2>
                <div className="space-y-3">
                  {course.material.content.map((item, index) => (
                    <p key={index} className="text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </p>
                  ))}
                </div>
                
                {!hasReadMaterial && (
                  <div className="mt-6 text-center">
                    <Button onClick={handleMarkAsRead}>
                      标记为已阅读
                    </Button>
                  </div>
                )}
                
                {hasReadMaterial && !quizCompleted && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-primary text-center">
                      ✅ 阅读材料已完成，请进行小测验
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="quiz" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">课程小测验</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  请回答以下问题，得分60分以上即可通过
                </p>
                
                <div className="space-y-6">
                  {course.quiz.map((question, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="font-medium">
                        {index + 1}. {question.question}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option.charAt(0)}
                              checked={quizAnswers[index] === option.charAt(0)}
                              onChange={(e) => setQuizAnswers(prev => ({
                                ...prev,
                                [index]: e.target.value
                              }))}
                              className="text-primary"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {!quizCompleted && (
                  <div className="mt-6 text-center">
                    <Button 
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < course.quiz.length}
                    >
                      提交测验
                    </Button>
                  </div>
                )}
                
                {quizCompleted && (
                  <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="font-medium text-success mb-1">测验通过！</p>
                    <p className="text-sm text-muted-foreground">
                      您的得分：{quizScore}分
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* 完成按钮 */}
          {quizCompleted && (
            <Card className="p-4 bg-success/5 border-success/20 mt-6">
              <div className="text-center">
                <Award className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="font-medium text-success-foreground mb-2">🎉 课程学习完成！</p>
                <p className="text-sm text-muted-foreground mb-4">
                  您已成功完成本课程的学习和测验。
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