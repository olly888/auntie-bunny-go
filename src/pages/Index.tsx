import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 自动重定向到工作台
    navigate("/workbench");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">兔到到</h1>
        <p className="text-muted-foreground">正在跳转到工作台...</p>
      </div>
    </div>
  );
};

export default Index;
