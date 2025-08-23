
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useDemoOrder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDemoOrder = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('create_demo_order_for_my_store');
      
      if (error) {
        console.error('Error creating demo order:', error);
        toast({
          title: "生成失败",
          description: error.message || "无法生成测试订单",
          variant: "destructive"
        });
        return false;
      }

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['task-hall-orders'] });
      queryClient.invalidateQueries({ queryKey: ['current-task'] });
      
      toast({
        title: "✅ 测试订单已生成",
        description: "新订单广播弹窗即将出现，任务大厅也会显示该订单"
      });

      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "生成失败",
        description: "网络错误，请重试",
        variant: "destructive"
      });
      return false;
    }
  };

  return { createDemoOrder };
};
