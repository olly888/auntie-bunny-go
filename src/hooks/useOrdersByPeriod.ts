
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from "date-fns";

export type TimePeriod = 'day' | 'month' | 'year';

interface Order {
  id: string;
  type: string;
  duration_minutes: number;
  address: string;
  payout: number;
  status: string;
  completed_at: string;
  assignee_id: string;
}

export const useOrdersByPeriod = (period: TimePeriod, selectedDate: Date) => {
  return useQuery({
    queryKey: ['orders-by-period', period, selectedDate],
    queryFn: async () => {
      console.log('Fetching orders for period:', period, 'date:', selectedDate);
      
      const { data: orders, error } = await supabase.rpc('get_filtered_orders');
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('All orders:', orders);

      // Filter completed orders assigned to current user
      const completedOrders = (orders || []).filter((order: Order) => 
        order.status === 'completed' && 
        order.assignee_id && 
        order.completed_at
      );

      console.log('Completed orders:', completedOrders);

      // Filter by selected period
      let periodStart: Date;
      let periodEnd: Date;

      switch (period) {
        case 'day':
          periodStart = startOfDay(selectedDate);
          periodEnd = endOfDay(selectedDate);
          break;
        case 'month':
          periodStart = startOfMonth(selectedDate);
          periodEnd = endOfMonth(selectedDate);
          break;
        case 'year':
          periodStart = startOfYear(selectedDate);
          periodEnd = endOfYear(selectedDate);
          break;
      }

      const filteredOrders = completedOrders.filter((order: Order) => {
        const completedAt = new Date(order.completed_at);
        return isWithinInterval(completedAt, { start: periodStart, end: periodEnd });
      });

      console.log('Filtered orders for period:', filteredOrders);

      // Calculate summary stats
      const totalCommission = filteredOrders.reduce((sum: number, order: Order) => sum + (order.payout || 0), 0);
      const totalOrders = filteredOrders.length;
      const totalServiceHours = filteredOrders.reduce((sum: number, order: Order) => sum + (order.duration_minutes || 0), 0) / 60;

      return {
        orders: filteredOrders,
        stats: {
          totalCommission,
          totalOrders,
          totalServiceHours: Math.round(totalServiceHours * 10) / 10
        }
      };
    },
  });
};
