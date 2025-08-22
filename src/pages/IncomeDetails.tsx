import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Download, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IncomeDetails = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");

  // Mock data - will be replaced with real data
  const incomeRecords = [
    {
      id: 1,
      date: "2024-01-20",
      type: "清洁服务",
      amount: 80,
      status: "已结算",
      orderNumber: "OR20240120001"
    },
    {
      id: 2,
      date: "2024-01-20",
      type: "家政服务",
      amount: 120,
      status: "已结算",
      orderNumber: "OR20240120002"
    },
    {
      id: 3,
      date: "2024-01-19",
      type: "维修服务",
      amount: 150,
      status: "已结算",
      orderNumber: "OR20240119001"
    },
  ];

  const totalIncome = incomeRecords.reduce((sum, record) => sum + record.amount, 0);

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
          <h1 className="text-2xl font-bold text-foreground">收入明细</h1>
        </div>

        {/* 筛选和导出 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              本月
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
        </div>

        {/* 收入汇总 */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground">
          <div className="text-center">
            <div className="text-sm opacity-90 mb-2">本月总收入</div>
            <div className="text-3xl font-bold">¥{totalIncome.toFixed(2)}</div>
            <div className="text-sm opacity-80 mt-2">共 {incomeRecords.length} 笔收入</div>
          </div>
        </Card>

        {/* 收入记录列表 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">收入记录</h2>
          
          {incomeRecords.map((record) => (
            <Card key={record.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{record.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {record.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    订单号: {record.orderNumber}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {record.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-success">+¥{record.amount}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 加载更多 */}
        <div className="text-center">
          <Button variant="outline">加载更多</Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default IncomeDetails;