
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDemoLogin = () => {
  const { toast } = useToast();

  const performDemoLogin = async (): Promise<boolean> => {
    try {
      // 使用演示账号登录
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@tudaodao.com',
        password: 'demo123456'
      });

      if (error) {
        // 如果账号不存在，自动注册
        if (error.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: 'demo@tudaodao.com',
            password: 'demo123456',
            options: {
              data: {
                full_name: '演示用户'
              }
            }
          });

          if (signUpError) {
            throw signUpError;
          }

          // 注册后再次登录
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email: 'demo@tudaodao.com',
            password: 'demo123456'
          });

          if (loginError) {
            throw loginError;
          }
        } else {
          throw error;
        }
      }

      toast({
        title: "演示登录成功",
        description: "已自动登录演示账户"
      });

      return true;
    } catch (error) {
      console.error('Demo login error:', error);
      toast({
        title: "演示登录失败",
        description: "请稍后重试",
        variant: "destructive"
      });
      return false;
    }
  };

  return { performDemoLogin };
};
