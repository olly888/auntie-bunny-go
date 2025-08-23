
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MapPin, Clock, DollarSign, Phone, User } from 'lucide-react';
import { OrderCountdown } from './OrderCountdown';
import { useClaimOrder } from '@/hooks/orders/useTaskHallOrders';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface Order {
  id: string;
  type: string;
  duration_minutes: number;
  address: string;
  payout: number;
  distance_minutes: number | null;
  created_at: string;
  contact_phone?: string | null;
  contact_name?: string | null;
}

interface OrderBroadcastModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderBroadcastModal({ order, onClose }: OrderBroadcastModalProps) {
  const claimOrder = useClaimOrder();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!order) return null;

  const handleClaimOrder = async () => {
    try {
      const success = await claimOrder(order.id);
      if (success) {
        toast({
          title: "抢单成功！",
          description: "订单已分配给您，请及时前往服务地点"
        });
        queryClient.invalidateQueries({ queryKey: ['current-task'] });
        onClose();
      } else {
        toast({
          title: "抢单失败",
          description: "订单已被其他阿姨抢走",
          variant: "destructive"
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "抢单失败",
        description: "网络错误，请重试",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={!!order} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md mx-4 p-0 gap-0 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">🔔 新订单推送</h2>
            <OrderCountdown 
              createdAt={order.created_at} 
              variant="broadcast"
              onExpire={onClose}
            />
          </div>

          {/* Order Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-blue-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">报酬</p>
                  <p className="font-semibold text-lg text-green-600">¥{order.payout}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">时长</p>
                  <p className="font-semibold">{order.duration_minutes}分钟</p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">服务地址</p>
                <p className="font-medium">{order.address}</p>
                {order.distance_minutes && (
                  <p className="text-sm text-gray-500">预计{order.distance_minutes}分钟路程</p>
                )}
              </div>
            </div>

            {order.contact_name && (
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">联系人</p>
                  <p className="font-medium">{order.contact_name}</p>
                </div>
              </div>
            )}

            {order.contact_phone && (
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">联系电话</p>
                  <p className="font-medium">{order.contact_phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300"
            >
              忽略
            </Button>
            <Button
              onClick={handleClaimOrder}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
            >
              立即抢单
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
