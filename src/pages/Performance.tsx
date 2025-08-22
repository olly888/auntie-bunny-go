import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { DataCard } from "@/components/ui/data-card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, Star, Clock, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Performance = () => {
  const navigate = useNavigate();

  // Mock performance data - will be replaced with real data
  const performanceData = {
    completedOrders: 156,
    averageRating: 4.8,
    punctualityRate: 96,
    completionRate: 98,
    totalWorkHours: 120,
    monthlyGrowth: 15
  };

  const serviceDistribution = [
    { type: "清洁服务", count: 68, percentage: 43.6 },
    { type: "家政服务", count: 45, percentage: 28.8 },
    { type: "维修服务", count: 32, percentage: 20.5 },
    { type: "配送服务", count: 11, percentage: 7.1 }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">我的业绩</h1>
        </div>

        {/* 核心指标 */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground">
          <div className="text-center">
            <div className="text-sm opacity-90 mb-2">本月业绩评分</div>
            <div className="text-4xl font-bold mb-2">优秀</div>
            <div className="text-sm opacity-80">
              比上月提升 {performanceData.monthlyGrowth}%
            </div>
          </div>
        </Card>

        {/* 核心数据 */}
        <div className="grid grid-cols-2 gap-4">
          <DataCard 
            title="完成订单" 
            value={performanceData.completedOrders} 
            unit="单"
          />
          <DataCard 
            title="平均评分" 
            value={performanceData.averageRating} 
            unit="分"
          />
          <DataCard 
            title="准时率" 
            value={performanceData.punctualityRate} 
            unit="%"
          />
          <DataCard 
            title="完成率" 
            value={performanceData.completionRate} 
            unit="%"
          />
        </div>

        {/* 工作时长统计 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">工作时长</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">本月总工时</span>
              <span className="font-bold text-foreground">{performanceData.totalWorkHours} 小时</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">日均工时</span>
              <span className="font-medium text-foreground">{(performanceData.totalWorkHours / 30).toFixed(1)} 小时</span>
            </div>
            <Progress value={75} className="w-full" />
            <div className="text-sm text-muted-foreground text-center">
              已完成本月目标的 75%
            </div>
          </div>
        </Card>

        {/* 服务类型分布 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">服务类型分布</h3>
          </div>
          <div className="space-y-4">
            {serviceDistribution.map((service, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{service.type}</span>
                  <span className="text-sm text-muted-foreground">{service.count} 单</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={service.percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {service.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 评价统计 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">评价统计</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{performanceData.averageRating}</div>
              <div className="text-sm text-muted-foreground">平均评分</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">98%</div>
              <div className="text-sm text-muted-foreground">好评率</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground text-center">
              客户满意度较高，继续保持优质服务！
            </div>
          </div>
        </Card>

        {/* 改进建议 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">改进建议</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-primary/5 rounded-lg">
              <div className="text-sm font-medium text-foreground">提升准时率</div>
              <div className="text-xs text-muted-foreground mt-1">
                建议提前10分钟到达服务地点
              </div>
            </div>
            <div className="p-3 bg-success/5 rounded-lg">
              <div className="text-sm font-medium text-foreground">保持服务质量</div>
              <div className="text-xs text-muted-foreground mt-1">
                您的服务质量很好，请继续保持
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Performance;