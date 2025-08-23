
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, 
  eachDayOfInterval, eachMonthOfInterval, format, isWithinInterval 
} from "date-fns";

export type TimePeriod = 'day' | 'month' | 'year';

interface Order {
  id: string;
  payout: number;
  completed_at: string;
  assignee_id: string;
  status: string;
}

export const useIncomeSeries = (period: TimePeriod, selectedDate: Date) => {
  return useQuery({
    queryKey: ['income-series', period, selectedDate],
    queryFn: async () => {
      console.log('Fetching income series for period:', period, 'date:', selectedDate);
      
      const { data: orders, error } = await supabase.rpc('get_filtered_orders');
      
      if (error) {
        console.error('Error fetching orders for series:', error);
        throw error;
      }

      // Filter completed orders assigned to current user
      const completedOrders = (orders || []).filter((order: Order) => 
        order.status === 'completed' && 
        order.assignee_id && 
        order.completed_at
      );

      let periodStart: Date;
      let periodEnd: Date;
      let intervals: Date[];
      let formatPattern: string;

      switch (period) {
        case 'day':
          periodStart = startOfDay(selectedDate);
          periodEnd = endOfDay(selectedDate);
          // For day view, show hourly intervals (simplified to 6 data points)
          intervals = Array.from({ length: 6 }, (_, i) => {
            const hour = i * 4; // 0, 4, 8, 12, 16, 20
            const date = new Date(selectedDate);
            date.setHours(hour, 0, 0, 0);
            return date;
          });
          formatPattern = 'HH:mm';
          break;
        case 'month':
          periodStart = startOfMonth(selectedDate);
          periodEnd = endOfMonth(selectedDate);
          intervals = eachDayOfInterval({ start: periodStart, end: periodEnd });
          formatPattern = 'MM-dd';
          break;
        case 'year':
          periodStart = startOfYear(selectedDate);
          periodEnd = endOfYear(selectedDate);
          intervals = eachMonthOfInterval({ start: periodStart, end: periodEnd });
          formatPattern = 'yyyy-MM';
          break;
      }

      // Create series data
      const series = intervals.map(interval => {
        let intervalStart: Date;
        let intervalEnd: Date;

        if (period === 'day') {
          intervalStart = interval;
          intervalEnd = new Date(interval);
          intervalEnd.setHours(interval.getHours() + 4);
        } else if (period === 'month') {
          intervalStart = startOfDay(interval);
          intervalEnd = endOfDay(interval);
        } else {
          intervalStart = startOfMonth(interval);
          intervalEnd = endOfMonth(interval);
        }

        const ordersInInterval = completedOrders.filter((order: Order) => {
          const completedAt = new Date(order.completed_at);
          return isWithinInterval(completedAt, { start: intervalStart, end: intervalEnd });
        });

        const commission = ordersInInterval.reduce((sum: number, order: Order) => sum + (order.payout || 0), 0);

        return {
          date: format(interval, formatPattern),
          commission,
          orders: ordersInInterval.length
        };
      });

      console.log('Generated income series:', series);
      return series;
    },
  });
};
