import { useState, useEffect, useCallback } from "react";
import { OrderInfo } from "@/components/order/GrabModal";

export interface DemoOrder extends OrderInfo {
  createdAt: Date;
  status: 'pending' | 'claimed' | 'completed';
}

const DEMO_ORDERS_KEY = 'demoOrders';
const COMPLETED_ORDERS_KEY = 'completedOrders';

const createDemoOrder = (id: string): DemoOrder => {
  const services = [
    { type: '🐰 洗碗兔', duration: '30分钟', payout: 25 },
    { type: '🧹 清洁兔', duration: '45分钟', payout: 35 },
    { type: '🍳 烹饪兔', duration: '60分钟', payout: 45 },
    { type: '🧺 洗衣兔', duration: '40分钟', payout: 30 }
  ];
  
  const addresses = [
    { address: 'xx小区A区', distance: '距您约3分钟' },
    { address: 'yy花园B栋', distance: '距您约5分钟' },
    { address: 'zz公寓C座', distance: '距您约2分钟' },
    { address: 'aa大厦D区', distance: '距您约7分钟' }
  ];

  const service = services[Math.floor(Math.random() * services.length)];
  const location = addresses[Math.floor(Math.random() * addresses.length)];

  return {
    id,
    type: service.type,
    duration: service.duration,
    address: location.address,
    distance: location.distance,
    payout: service.payout,
    createdAt: new Date(),
    status: 'pending'
  };
};

export const useDemoOrders = () => {
  const [pendingOrders, setPendingOrders] = useState<DemoOrder[]>([]);
  const [completedOrders, setCompletedOrders] = useState<DemoOrder[]>([]);
  const [currentOrder, setCurrentOrder] = useState<DemoOrder | null>(null);

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedPending = localStorage.getItem(DEMO_ORDERS_KEY);
    const savedCompleted = localStorage.getItem(COMPLETED_ORDERS_KEY);
    
    if (savedPending) {
      try {
        const parsed = JSON.parse(savedPending);
        setPendingOrders(parsed.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt)
        })));
      } catch (e) {
        console.error('Error parsing saved pending orders:', e);
      }
    }

    if (savedCompleted) {
      try {
        const parsed = JSON.parse(savedCompleted);
        setCompletedOrders(parsed.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt)
        })));
      } catch (e) {
        console.error('Error parsing saved completed orders:', e);
      }
    }
  }, []);

  // 保存待接订单到 localStorage
  useEffect(() => {
    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(pendingOrders));
  }, [pendingOrders]);

  // 保存已完成订单到 localStorage
  useEffect(() => {
    localStorage.setItem(COMPLETED_ORDERS_KEY, JSON.stringify(completedOrders));
  }, [completedOrders]);

  // 创建演示订单
  const createOrder = useCallback(() => {
    const newOrder = createDemoOrder(Date.now().toString());
    setPendingOrders(prev => [...prev, newOrder]);
    return newOrder;
  }, []);

  // 抢单
  const claimOrder = useCallback((orderId: string) => {
    const order = pendingOrders.find(o => o.id === orderId);
    if (order) {
      const claimedOrder = { ...order, status: 'claimed' as const };
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      setCurrentOrder(claimedOrder);
      return claimedOrder;
    }
    return null;
  }, [pendingOrders]);

  // 完成订单
  const completeOrder = useCallback(() => {
    if (currentOrder) {
      const completedOrder = { ...currentOrder, status: 'completed' as const };
      setCompletedOrders(prev => [...prev, completedOrder]);
      setCurrentOrder(null);
      return completedOrder;
    }
    return null;
  }, [currentOrder]);

  // 删除待接订单
  const removePendingOrder = useCallback((orderId: string) => {
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  // 清空所有演示数据
  const clearAllOrders = useCallback(() => {
    setPendingOrders([]);
    setCompletedOrders([]);
    setCurrentOrder(null);
    localStorage.removeItem(DEMO_ORDERS_KEY);
    localStorage.removeItem(COMPLETED_ORDERS_KEY);
  }, []);

  // 计算今日统计
  const todayStats = {
    completed: completedOrders.filter(order => {
      const today = new Date().toDateString();
      return order.createdAt.toDateString() === today;
    }).length,
    earnings: completedOrders.filter(order => {
      const today = new Date().toDateString();
      return order.createdAt.toDateString() === today;
    }).reduce((sum, order) => sum + order.payout, 0)
  };

  return {
    pendingOrders,
    completedOrders,
    currentOrder,
    todayStats,
    createOrder,
    claimOrder,
    completeOrder,
    removePendingOrder,
    clearAllOrders
  };
};