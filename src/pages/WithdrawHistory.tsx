import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WithdrawRecord {
  id: string;
  amount: number;
  status: "审核中" | "已批准" | "已到账" | "已驳回";
  submitTime: string;
  expectedArrival?: string;
  actualArrival?: string;
  method: string;
}

const WithdrawHistory = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<WithdrawRecord[]>([]);

  useEffect(() => {
    // 从本地存储加载提现记录
    const savedRecords = localStorage.getItem("withdrawHistory");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    } else {
      // 模拟一些历史记录
      const demoRecords: WithdrawRecord[] = [
        {
          id: "1",
          amount: 89.50,
          status: "已到账",
          submitTime: "2024-01-15T10:30:00.000Z",
          actualArrival: "2024-01-16T14:20:00.000Z",
          method: "微信钱包"
        },
        {
          id: "2", 
          amount: 156.20,
          status: "已到账",
          submitTime: "2024-01-10T16:45:00.000Z",
          actualArrival: "2024-01-12T09:15:00.000Z",
          method: "微信钱包"
        }
      ];
      setRecords(demoRecords);
    }
  }, []);

  const getStatusColor = (status: WithdrawRecord["status"]) => {
    switch (status) {
      case "审核中":
        return "bg-warning/20 text-warning-foreground border-warning";
      case "已批准":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-300";
      case "已到账":
        return "bg-success/20 text-success-foreground border-success";
      case "已驳回":
        return "bg-destructive/20 text-destructive-foreground border-destructive";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit", 
        day: "2-digit"
      }),
      time: date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">提现记录</h1>
          <div className="w-9" /> {/* 占位符保持标题居中 */}
        </div>

        <div className="p-4">
          {records.length === 0 ? (
            <div className="text-center py-16">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-foreground font-medium mb-2">暂无提现记录</div>
              <div className="text-sm text-muted-foreground">您还没有申请过提现</div>
              <Button 
                className="mt-6"
                onClick={() => navigate("/withdraw")}
              >
                立即提现
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => {
                const submitDateTime = formatDateTime(record.submitTime);
                const arrivalDateTime = record.actualArrival 
                  ? formatDateTime(record.actualArrival) 
                  : null;

                return (
                  <div 
                    key={record.id}
                    className="bg-card border border-border rounded-xl p-4 shadow-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">
                          ¥{record.amount.toFixed(2)}
                        </span>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">提现方式</span>
                        <span className="text-foreground">{record.method}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">申请时间</span>
                        <div className="text-right">
                          <div className="text-foreground">{submitDateTime.date}</div>
                          <div className="text-xs text-muted-foreground">{submitDateTime.time}</div>
                        </div>
                      </div>

                      {(record.status === "审核中" || record.status === "已批准") && record.expectedArrival && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">预计到账</span>
                          <span className="text-foreground">{record.expectedArrival}</span>
                        </div>
                      )}

                      {record.status === "已到账" && arrivalDateTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">到账时间</span>
                          <div className="text-right">
                            <div className="text-foreground">{arrivalDateTime.date}</div>
                            <div className="text-xs text-muted-foreground">{arrivalDateTime.time}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawHistory;