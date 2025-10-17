import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const CertificationTest = () => {
  const navigate = useNavigate();
  const { skillId } = useParams();
  const [searchParams] = useSearchParams();
  const testType = searchParams.get('type');
  const { user, profile, refreshProfile } = useAuthContext();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Mock questions - in real app, fetch based on skillId
  const questions: Question[] = [
    {
      id: 1,
      question: "在进入客户家中前，应该做什么？",
      options: [
        "直接开始工作",
        "换鞋套并礼貌问候",
        "先参观房间",
        "立即询问付款方式"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "服务过程中遇到客户投诉，正确的做法是？",
      options: [
        "立即反驳客户",
        "不理睬继续工作",
        "耐心倾听并道歉，寻找解决方案",
        "直接离开现场"
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "服务完成后应该做什么？",
      options: [
        "立即离开",
        "要求客户打赏",
        "请客户验收并确认满意",
        "直接收拾工具离开"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "发现客户家中贵重物品时，正确的做法是？",
      options: [
        "拍照留念",
        "提醒客户妥善保管并避免触碰",
        "帮忙移动到安全位置",
        "询问物品价值"
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "与客户沟通时，哪种方式最合适？",
      options: [
        "大声说话确保对方听到",
        "使用专业术语显示专业性",
        "语气平和、用词礼貌、耐心解释",
        "快速说话节省时间"
      ],
      correctAnswer: 2
    }
  ];

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error("请选择一个答案");
      return;
    }

    setAnswers({ ...answers, [currentQuestion]: selectedAnswer });
    setSelectedAnswer(null);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      calculateScore();
    }
  };

  const calculateScore = async () => {
    const finalAnswers = { ...answers, [currentQuestion]: selectedAnswer };
    let correct = 0;

    questions.forEach((q, index) => {
      if (finalAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / totalQuestions) * 100);
    
    if (score >= 80) {
      // Pass the test
      if (testType === 'onboarding') {
        try {
          const storedProfile = localStorage.getItem("mock_user_profile");
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            profile.is_training_completed = true;
            profile.updated_at = new Date().toISOString();

            // 检查是否满足激活条件（实名认证 + 新人培训）
            if (profile.is_id_verified) {
              profile.onboarding_status = 'activated';
              localStorage.setItem("mock_user_profile", JSON.stringify(profile));
              toast.success("🎉 恭喜激活成功！", {
                description: "您现在可以开始接单赚钱了！"
              });
              setTimeout(() => navigate('/workbench'), 2000);
            } else {
              localStorage.setItem("mock_user_profile", JSON.stringify(profile));
              toast.success("培训完成！", {
                description: "还需完成实名认证"
              });
              setTimeout(() => navigate('/profile/details'), 2000);
            }
          }
        } catch (error) {
          console.error('Error updating training status:', error);
        }
      } else {
        toast.success("恭喜！您已通过认证测试！");
        setTimeout(() => navigate('/skills-training'), 2000);
      }
    } else {
      toast.error(`很遗憾，您的得分为${score}分，需要80分以上才能通过。请继续学习后再试。`);
      setTimeout(() => navigate('/skills-training'), 3000);
    }
    
    setShowResult(true);
  };

  const currentQ = questions[currentQuestion];

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
            <h1 className="text-2xl font-bold text-foreground">认证测试</h1>
            <p className="text-sm text-muted-foreground">需要答对80%以上的题目</p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              第 {currentQuestion + 1} 题 / 共 {totalQuestions} 题
            </span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {!showResult ? (
          <>
            {/* 题目 */}
            <Card className="p-6 bg-gradient-card">
              <h2 className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
                {currentQ.question}
              </h2>

              <RadioGroup 
                value={selectedAnswer?.toString()} 
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                className="space-y-4"
              >
                {currentQ.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedAnswer === index 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-foreground leading-relaxed"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>

            {/* 下一题按钮 */}
            <Button 
              onClick={handleNext}
              className="w-full h-12 text-base"
              disabled={selectedAnswer === null}
            >
              {currentQuestion < totalQuestions - 1 ? '下一题' : '提交答案'}
            </Button>
          </>
        ) : (
          <Card className="p-8 text-center bg-gradient-card">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">测试完成</h2>
            <p className="text-muted-foreground">正在评估您的答案...</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CertificationTest;
