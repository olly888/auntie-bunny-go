import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  // 发送验证码（暂时使用邮箱，因为Supabase短信需要付费）
  const sendOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { success: !error, error };
  };

  // 验证码登录
  const verifyOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'email'
    });
    return { data, error };
  };

  // 邮箱密码登录
  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  // 邮箱密码注册
  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: metadata
      }
    });
    return { data, error };
  };

  // 检查登录状态
  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  // 登出
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { success: !error, error };
  };

  return { 
    sendOtp, 
    verifyOtp, 
    signInWithPassword,
    signUp,
    checkAuth, 
    signOut 
  };
};
