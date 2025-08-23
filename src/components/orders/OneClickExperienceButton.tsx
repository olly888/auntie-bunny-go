
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDemoLogin } from '@/hooks/useDemoLogin';
import { useDemoOrder } from '@/hooks/orders/useDemoOrder';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function OneClickExperienceButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { performDemoLogin } = useDemoLogin();
  const { createDemoOrder } = useDemoOrder();

  const handleOneClickExperience = async () => {
    setIsLoading(true);
    
    try {
      // 检查当前登录状态
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // 如果未登录，先执行演示登录
        const loginSuccess = await performDemoLogin();
        if (!loginSuccess) {
          return;
        }
        
        // 等待一会让登录状态更新
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 创建演示订单
      const success = await createDemoOrder();
      
      if (success) {
        toast({
          title: "🎉 体验开始！",
          description: "演示订单已创建，广播弹窗即将出现，您可以在任务大厅抢单体验完整流程"
        });
      }
    } catch (error) {
      console.error('One-click experience error:', error);
      toast({
        title: "体验启动失败",
        description: "请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleOneClickExperience}
      disabled={isLoading}
      size="sm"
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4 mr-1" />
      )}
      一键体验
    </Button>
  );
}
