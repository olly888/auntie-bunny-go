import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, MapPin, Clock, Banknote, Phone, User, Calendar, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderDetail {
  id: string;
  type: string;
  address: string;
  duration_minutes: number;
  payout: number;
  status: string;
  created_at: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
  contact_phone?: string;
  contact_name?: string;
  settled?: boolean;
  settled_at?: string;
  total_amount?: number;
  paid_amount?: number;
  assignee_id?: string;
  store_id?: string;
  distance_minutes?: number;
  latitude?: number;
  longitude?: number;
  updated_at?: string;
}

interface OrderPhoto {
  id: string;
  photo_url: string;
  created_at: string;
}

interface CustomerNote {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
}

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // 查询订单详情
  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: async () => {
      const { data: orders, error } = await supabase.rpc('get_filtered_orders');
      
      if (error) throw error;
      
      const order = orders?.find((o: any) => o.id === orderId);
      if (!order) throw new Error('订单不存在');
      
      return order as OrderDetail;
    },
    enabled: !!orderId,
  });

  // 查询订单照片
  const { data: photos = [] } = useQuery({
    queryKey: ['order-photos', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_photos')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as OrderPhoto[];
    },
    enabled: !!orderId,
  });

  // 查询客户备注
  const { data: notes = [] } = useQuery({
    queryKey: ['customer-notes', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_notes')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CustomerNote[];
    },
    enabled: !!orderId,
  });

  const getOrderTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'cleaning': '清洁服务',
      'maintenance': '维修服务',
      'delivery': '配送服务',
      'other': '其他服务'
    };
    return typeMap[type] || type;
  };

  const getOrderTypeIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      'cleaning': '🧽',
      'maintenance': '🔧',
      'delivery': '📦',
      'other': '💼'
    };
    return iconMap[type] || '📋';
  };

  if (orderLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto p-4 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto p-4 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">订单详情</h1>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-lg mb-2">订单不存在</div>
            <div className="text-sm">该订单可能已被删除或您无权访问</div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-4">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">订单详情</h1>
        </div>

        {/* 订单基本信息 */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getOrderTypeIcon(order.type)}</div>
            <div className="flex-1">
              <div className="font-semibold text-lg text-foreground">
                {getOrderTypeLabel(order.type)}
              </div>
              <div className="text-sm text-muted-foreground">
                订单号：#{order.id.slice(-8).toUpperCase()}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'completed' 
                ? 'bg-success/10 text-success' 
                : 'bg-warning/10 text-warning'
            }`}>
              {order.status === 'completed' ? '已完成' : order.status}
            </div>
          </div>
        </div>

        {/* 服务地址 */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">服务地址</div>
              <div className="text-foreground font-medium">{order.address}</div>
            </div>
          </div>
        </div>

        {/* 时间信息 */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Clock className="w-5 h-5 text-primary" />
            <span>时间信息</span>
          </div>
          
          <div className="space-y-2 pl-7">
            {order.started_at && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">开始时间</span>
                <span className="text-foreground">
                  {format(new Date(order.started_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                </span>
              </div>
            )}
            
            {order.completed_at && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">完成时间</span>
                <span className="text-foreground">
                  {format(new Date(order.completed_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                </span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">服务时长</span>
              <span className="text-foreground font-medium">
                {order.duration_minutes} 分钟
              </span>
            </div>
          </div>
        </div>

        {/* 收入信息 */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-border/50 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Banknote className="w-5 h-5 text-primary" />
            <span>收入信息</span>
          </div>
          
          <div className="space-y-2 pl-7">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">服务费</span>
              <span className="text-2xl font-bold text-primary">
                ¥{order.payout.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">结算状态</span>
              <span className={`font-medium ${
                order.settled ? 'text-success' : 'text-warning'
              }`}>
                {order.settled ? '已结算' : '待结算'}
              </span>
            </div>
            
            {order.settled && order.settled_at && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">结算时间</span>
                <span className="text-foreground">
                  {format(new Date(order.settled_at), 'yyyy-MM-dd', { locale: zhCN })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 客户信息 */}
        {(order.contact_name || order.contact_phone) && (
          <div className="bg-card rounded-xl p-4 shadow-card border border-border/50 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <User className="w-5 h-5 text-primary" />
              <span>客户信息</span>
            </div>
            
            <div className="space-y-2 pl-7">
              {order.contact_name && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">联系人</span>
                  <span className="text-foreground">{order.contact_name}</span>
                </div>
              )}
              
              {order.contact_phone && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">联系电话</span>
                  <span className="text-foreground">{order.contact_phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 服务照片 */}
        {photos.length > 0 && (
          <div className="bg-card rounded-xl p-4 shadow-card border border-border/50 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <ImageIcon className="w-5 h-5 text-primary" />
              <span>服务照片</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo) => (
                <div 
                  key={photo.id}
                  className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open(photo.photo_url, '_blank')}
                >
                  <img 
                    src={photo.photo_url} 
                    alt="服务照片"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 服务记录 */}
        {notes.length > 0 && (
          <div className="bg-card rounded-xl p-4 shadow-card border border-border/50 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>服务记录</span>
            </div>
            
            <div className="space-y-3 pl-7">
              {notes.map((note) => (
                <div key={note.id} className="space-y-1">
                  <div className="text-sm text-foreground">{note.content}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{note.author_name || '服务人员'}</span>
                    <span>•</span>
                    <span>
                      {format(new Date(note.created_at), 'MM-dd HH:mm', { locale: zhCN })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      
      <BottomNav />
    </div>
  );
};

export default OrderDetail;
