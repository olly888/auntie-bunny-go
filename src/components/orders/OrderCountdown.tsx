import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface OrderCountdownProps {
  createdAt: string;
  durationMinutes?: number;
}

export function OrderCountdown({ createdAt, durationMinutes = 10 }: OrderCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(createdAt).getTime();
      const expiryTime = createdTime + (durationMinutes * 60 * 1000);
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
      return remaining;
    };

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [createdAt, durationMinutes]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isExpired = timeLeft === 0;

  return (
    <div className={`flex items-center text-sm ${
      isExpired ? 'text-muted-foreground' : 'text-destructive'
    }`}>
      <Clock className="w-3 h-3 mr-1" />
      {isExpired ? '已过期' : formatTime(timeLeft)}
    </div>
  );
}