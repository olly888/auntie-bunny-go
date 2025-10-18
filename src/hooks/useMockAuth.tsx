import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface MockUser {
  id: string;
  name: string;
  phone: string;
  role: 'non-direct' | 'direct';
  isVerified: boolean;
  bankBound: boolean;
}

interface MockAuthState {
  isAuthenticated: boolean;
  user: MockUser | null;
  lastLoginMethod: 'wechat' | 'phone' | null;
}

interface MockAuthContextType {
  state: MockAuthState;
  loginWithWeChat: () => Promise<void>;
  sendOtp: (phone: string) => Promise<{ success: boolean; countdown: number }>;
  loginWithPhone: (data: { phone: string; code: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setLastLoginMethod: (method: 'wechat' | 'phone') => void;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return context;
};

// 用于存储OTP验证码的临时状态
let otpStorage: { [phone: string]: { code: string; expiry: number } } = {};

export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
  // SECURITY: Only enable mock auth in development mode
  const isDevelopment = import.meta.env.DEV;
  
  const [state, setState] = useState<MockAuthState>(() => {
    // In production, never use localStorage for authentication
    if (!isDevelopment) {
      return {
        isAuthenticated: false,
        user: null,
        lastLoginMethod: null,
      };
    }
    
    const storedUser = localStorage.getItem("mock_user");
    const lastMethod = localStorage.getItem("last_login_method") as 'wechat' | 'phone' | null;
    
    return {
      isAuthenticated: !!storedUser,
      user: storedUser ? JSON.parse(storedUser) : null,
      lastLoginMethod: lastMethod,
    };
  });

  const navigate = useNavigate();

  // 微信一键登录（模拟）
  const loginWithWeChat = async () => {
    // SECURITY: Disabled in production
    if (!isDevelopment) {
      toast({
        title: "功能不可用",
        description: "此功能仅在开发模式下可用，请使用真实登录",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // 模拟微信登录
      const mockUser: MockUser = {
        id: "user_wechat_001",
        name: "李阿姨",
        phone: "138****8888",
        role: 'non-direct',
        isVerified: true,
        bankBound: true,
      };

      setState({
        isAuthenticated: true,
        user: mockUser,
        lastLoginMethod: 'wechat',
      });

      localStorage.setItem("mock_user", JSON.stringify(mockUser));
      localStorage.setItem("last_login_method", "wechat");

      toast({
        title: "登录成功",
        description: "欢迎回来！",
        variant: "default",
      });

      navigate("/workbench");
    } catch (error) {
      toast({
        title: "登录失败",
        description: "微信登录出现问题，请稍后重试",
        variant: "destructive",
      });
      throw error;
    }
  };

  // 发送OTP验证码（模拟）
  const sendOtp = async (phone: string) => {
    // SECURITY: Disabled in production
    if (!isDevelopment) {
      return { success: false, countdown: 0 };
    }
    
    // 检查是否为未授权手机号（以199开头）
    if (phone.startsWith('199')) {
      toast({
        title: "账号未授权",
        description: "该手机号未授权，请联系运营经理开通权限",
        variant: "destructive",
      });
      return { success: false, countdown: 0 };
    }

    // 模拟发送验证码，固定为123456
    const code = "123456";
    const expiry = Date.now() + 5 * 60 * 1000; // 5分钟有效期
    
    otpStorage[phone] = { code, expiry };

    toast({
        title: "验证码已发送",
        description: `验证码已发送至 ${phone}（演示码：123456）`,
        variant: "default",
    });

    return { success: true, countdown: 60 };
  };

  // 手机验证码登录
  const loginWithPhone = async (data: { phone: string; code: string }) => {
    // SECURITY: Disabled in production
    if (!isDevelopment) {
      return {
        success: false,
        error: "此功能仅在开发模式下可用，请使用真实登录"
      };
    }
    
    const { phone, code } = data;

    // 检查是否为未授权手机号
    if (phone.startsWith('199')) {
      return {
        success: false,
        error: "该手机号未授权，请联系运营经理开通权限"
      };
    }

    // 检查验证码
    const storedOtp = otpStorage[phone];
    if (!storedOtp || storedOtp.expiry < Date.now()) {
      return {
        success: false,
        error: "验证码已过期，请重新获取"
      };
    }

    if (storedOtp.code !== code) {
      return {
        success: false,
        error: "验证码错误，请检查后重新输入"
      };
    }

    // 登录成功
    const mockUser: MockUser = {
      id: `user_phone_${phone}`,
      name: "张阿姨",
      phone,
      role: 'non-direct',
      isVerified: true,
      bankBound: true,
    };

    setState({
      isAuthenticated: true,
      user: mockUser,
      lastLoginMethod: 'phone',
    });

    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    localStorage.setItem("last_login_method", "phone");

    // 清除验证码
    delete otpStorage[phone];

    toast({
      title: "登录成功",
      description: "欢迎回来！",
      variant: "default",
    });

    navigate("/workbench");

    return { success: true };
  };

  // 登出
  const logout = () => {
    setState({
      isAuthenticated: false,
      user: null,
      lastLoginMethod: state.lastLoginMethod, // 保留最后登录方式
    });
    localStorage.removeItem("mock_user");
  };

  // 设置最后登录方式
  const setLastLoginMethod = (method: 'wechat' | 'phone') => {
    setState(prev => ({ ...prev, lastLoginMethod: method }));
    localStorage.setItem("last_login_method", method);
  };

  const contextValue: MockAuthContextType = {
    state,
    loginWithWeChat,
    sendOtp,
    loginWithPhone,
    logout,
    setLastLoginMethod,
  };

  return (
    <MockAuthContext.Provider value={contextValue}>
      {children}
    </MockAuthContext.Provider>
  );
};