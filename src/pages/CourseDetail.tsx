import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CourseContent {
  id: number;
  title: string;
  duration: string;
  minReadTime: number; // 最小学习时长（秒）
  sections: Array<{
    type: 'text' | 'image' | 'list';
    content?: string;
    src?: string;
    items?: string[];
  }>;
}

const courseData: Record<number, CourseContent> = {
  1: {
    id: 1,
    title: "欢迎加入兔到到",
    duration: "2分钟",
    minReadTime: 60,
    sections: [
      { type: 'text', content: '欢迎您成为兔到到平台的服务人员！' },
      { type: 'text', content: '兔到到致力于为社区居民提供专业、可靠的家政服务，而您将是这份美好服务的传递者。' },
      { type: 'list', items: [
        '为社区居民提供优质服务',
        '灵活安排工作时间',
        '获得合理的服务报酬',
        '享受平台保障和支持'
      ]},
      { type: 'text', content: '让我们一起为更多家庭带去温暖和便利！' }
    ]
  },
  2: {
    id: 2,
    title: "平台规则与服务标准",
    duration: "5分钟",
    minReadTime: 120,
    sections: [
      { type: 'text', content: '作为兔到到的服务人员，请务必遵守以下规则：' },
      { type: 'list', items: [
        '准时到达服务地点，不迟到、不早退',
        '穿着整洁，保持良好的个人形象',
        '使用礼貌用语，尊重客户',
        '保护客户隐私，不泄露客户信息',
        '认真完成服务，确保质量达标'
      ]},
      { type: 'text', content: '违反规则可能导致警告、暂停接单甚至账号封禁。' }
    ]
  },
  3: {
    id: 3,
    title: "安全作业规范",
    duration: "5分钟",
    minReadTime: 120,
    sections: [
      { type: 'text', content: '您的安全和客户的安全同样重要，请注意：' },
      { type: 'list', items: [
        '使用清洁工具前检查电源和安全性',
        '避免在湿滑地面作业',
        '正确使用清洁剂，避免混用',
        '遇到可疑情况及时联系平台',
        '不接受客户额外的不合理要求'
      ]},
      { type: 'text', content: '如遇紧急情况，请立即拨打平台客服电话：400-123-4567' }
    ]
  },
  4: {
    id: 4,
    title: "接单与服务流程",
    duration: "8分钟",
    minReadTime: 180,
    sections: [
      { type: 'text', content: '完整的服务流程如下：' },
      { type: 'list', items: [
        '1. 上线接单：打开"上线接单"开关',
        '2. 接收订单：系统推送或主动在任务大厅抢单',
        '3. 确认信息：查看服务地址和客户联系方式',
        '4. 前往服务：按时到达服务地点',
        '5. 开始服务：在APP中点击"开始服务"',
        '6. 完成服务：服务完成后点击"完成订单"',
        '7. 上传照片：拍摄服务前后对比照',
        '8. 获得报酬：系统自动结算到钱包'
      ]},
      { type: 'text', content: '记住这些流程，让服务更顺畅！' }
    ]
  }
};

const CourseDetail = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [timeSpent, setTimeSpent] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  
  const course = courseData[Number(lessonId)];

  useEffect(() => {
    if (!course) return;

    const interval = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        if (newTime >= course.minReadTime) {
          setCanComplete(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [course]);

  const handleComplete = () => {
    if (!canComplete) {
      toast.error("请完整阅读课程内容");
      return;
    }

    // 保存完成状态到localStorage
    const completed = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
    if (!completed.includes(Number(lessonId))) {
      completed.push(Number(lessonId));
      localStorage.setItem('completed_lessons', JSON.stringify(completed));
    }

    toast.success("课程完成！");
    navigate('/skills-training/course/0');
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <Button variant="ghost" onClick={() => navigate('/skills-training/course/0')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <Card className="p-8 text-center mt-4">
            <p className="text-muted-foreground">课程不存在</p>
          </Card>
        </div>
      </div>
    );
  }

  const progress = Math.min((timeSpent / course.minReadTime) * 100, 100);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/skills-training/course/0')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{course.title}</h1>
            <p className="text-sm text-muted-foreground">⏱️ {course.duration}</p>
          </div>
        </div>

        {/* Progress Card */}
        {!canComplete && (
          <Card className="p-4 bg-accent/5">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">学习进度</p>
                <p className="text-xs text-muted-foreground">
                  {timeSpent}秒 / {course.minReadTime}秒
                </p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </Card>
        )}

        {canComplete && (
          <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                已完成学习，可以继续下一步
              </p>
            </div>
          </Card>
        )}

        {/* Course Content */}
        <Card className="p-6">
          <div className="space-y-4">
            {course.sections.map((section, index) => {
              if (section.type === 'text') {
                return (
                  <p key={index} className="text-base leading-relaxed">
                    {section.content}
                  </p>
                );
              }
              
              if (section.type === 'list') {
                return (
                  <ul key={index} className="space-y-2 ml-4">
                    {section.items?.map((item, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              if (section.type === 'image') {
                return (
                  <img 
                    key={index}
                    src={section.src} 
                    alt="课程图片" 
                    className="w-full rounded-lg"
                  />
                );
              }

              return null;
            })}
          </div>
        </Card>

        {/* Complete Button */}
        <Button 
          onClick={handleComplete}
          disabled={!canComplete}
          className="w-full h-12 text-base"
        >
          {canComplete ? '完成学习' : `继续阅读 (${course.minReadTime - timeSpent}秒)`}
        </Button>
      </div>
    </div>
  );
};

export default CourseDetail;