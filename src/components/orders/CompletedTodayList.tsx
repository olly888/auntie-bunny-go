import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/hooks/orders/useTaskHallOrders';

const useCompletedTodayOrders = () => {
  return useQuery({
    queryKey: ['completed-today-orders'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('orders')
        .select('id, type, duration_minutes, address, payout, completed_at')
        .eq('assignee_id', (await supabase.auth.getUser()).data.user?.id!)
        .eq('status', 'completed')
        .gte('completed_at', today.toISOString())
        .lt('completed_at', tomorrow.toISOString())
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

const getOrderIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    "清洁服务": "🧹",
    "家政服务": "🏠", 
    "维修服务": "🔧",
    "配送服务": "📦",
    "其他服务": "🛎️"
  };
  return icons[type] || "📋";
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const CompletedTodayList = () => {
  const { data: orders, isLoading, error } = useCompletedTodayOrders();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-48"></div>
              </div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>加载失败，请稍后重试</p>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">今日暂无已完成任务</p>
        <p className="text-sm mt-1">完成任务后会在这里显示</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">今日已完成 ({orders.length})</h3>
        <Badge variant="outline" className="text-success border-success">
          <CheckCircle className="w-3 h-3 mr-1" />
          已完成
        </Badge>
      </div>
      
      {orders.map((order) => (
        <Card key={order.id} className="p-4 border-l-4 border-l-success">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getOrderIcon(order.type)}</span>
                <span className="font-medium text-foreground">{order.type}</span>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {order.duration_minutes}分钟
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{order.address}</span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                完成时间: {formatTime(order.completed_at!)}
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-success">¥{order.payout}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};