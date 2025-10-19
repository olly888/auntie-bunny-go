import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status and redirect accordingly
    const mockUser = localStorage.getItem("mock_user");
    const mockProfile = localStorage.getItem("mock_user_profile");

    if (!mockUser) {
      // 未登录 -> 跳转到登录页
      navigate("/auth", { replace: true });
    } else if (!mockProfile) {
      // 已登录但未注册 -> 跳转到快速注册页
      navigate("/register", { replace: true });
    } else {
      // 已登录且已注册 -> 跳转到工作台
      navigate("/workbench", { replace: true });
    }
  }, [navigate]);

  // 显示加载状态
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">加载中...</p>
      </div>
    </div>
  );
};

export default Index;
