
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDemoLogin = () => {
  const { toast } = useToast();

  const performDemoLogin = async (): Promise<boolean> => {
    try {
      // 使用演示账号登录
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demo123456'
      });

      if (error) {
        // 如果账号不存在，自动注册
        if (error.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: 'demo@example.com',
            password: 'demo123456',
            options: {
              emailRedirectTo: window.location.origin,
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
            email: 'demo@example.com',
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
      
      let errorMessage = "请稍后重试";
      
      // 根据错误类型提供更具体的错误信息
      if (error instanceof Error) {
        if (error.message.includes('signup')) {
          errorMessage = "请在 Supabase Dashboard > Authentication > Providers 中启用 Email/Password 并允许用户注册";
        } else if (error.message.includes('invalid')) {
          errorMessage = "请检查 Supabase 认证设置";
        }
      }
      
      toast({
        title: "演示登录失败",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  return { performDemoLogin };
};
