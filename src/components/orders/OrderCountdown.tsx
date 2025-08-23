
import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface OrderCountdownProps {
  createdAt: string;
  variant?: 'broadcast' | 'taskHall';
  onExpire?: () => void;
}

export function OrderCountdown({ createdAt, variant = 'taskHall', onExpire }: OrderCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const createdTime = new Date(createdAt).getTime();
      const now = Date.now();
      const elapsed = now - createdTime;
      
      let totalTime: number;
      if (variant === 'broadcast') {
        // 10 seconds for broadcast popup
        totalTime = 10 * 1000;
      } else {
        // 40 seconds total (10s broadcast + 30s task hall before escalation)
        totalTime = 40 * 1000;
      }
      
      const remaining = Math.max(0, totalTime - elapsed);
      setTimeRemaining(remaining);
      
      if (remaining === 0 && !isExpired) {
        setIsExpired(true);
        onExpire?.();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 100);

    return () => clearInterval(interval);
  }, [createdAt, variant, onExpire, isExpired]);

  const seconds = Math.ceil(timeRemaining / 1000);
  const progress = variant === 'broadcast' 
    ? (timeRemaining / (10 * 1000)) * 100
    : (timeRemaining / (40 * 1000)) * 100;

  if (isExpired && variant === 'taskHall') {
    return (
      <div className="flex items-center text-orange-600">
        <AlertTriangle className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">即将转入异常处理</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Clock className={`w-4 h-4 ${seconds <= 5 ? 'text-red-500' : 'text-orange-500'}`} />
      <div className="flex-1">
        <div className={`text-sm font-medium ${seconds <= 5 ? 'text-red-500' : 'text-orange-500'}`}>
          {variant === 'broadcast' ? '抢单倒计时' : '自动升级倒计时'}: {seconds}秒
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className={`h-1.5 rounded-full transition-all duration-100 ${
              seconds <= 5 ? 'bg-red-500' : 'bg-orange-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
