import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay, startOfYear, endOfYear } from 'date-fns';

export type TimePeriod = 'day' | 'month' | 'year';

export interface IncomeStats {
  totalCommission: number;
  completedOrders: number;
  serviceHours: number;
  averageRating: number;
  onTimeRate: number;
  baseSalary: number;
}

export interface IncomeData {
  stats: IncomeStats;
  chartData: Array<{
    date: string;
    commission: number;
    orders: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

export function useIncomeData(period: TimePeriod, selectedDate: Date): IncomeData {
  const [data, setData] = useState<IncomeData>({
    stats: {
      totalCommission: 0,
      completedOrders: 0,
      serviceHours: 0,
      averageRating: 4.9,
      onTimeRate: 98,
      baseSalary: 3500,
    },
    chartData: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchIncomeData = async () => {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Calculate date range based on period
        let startDate: Date;
        let endDate: Date;

        switch (period) {
          case 'day':
            startDate = startOfDay(selectedDate);
            endDate = endOfDay(selectedDate);
            break;
          case 'month':
            startDate = startOfMonth(selectedDate);
            endDate = endOfMonth(selectedDate);
            break;
          case 'year':
            startDate = startOfYear(selectedDate);
            endDate = endOfYear(selectedDate);
            break;
        }

        // Fetch orders data using the filtered orders function
        const { data: ordersData, error } = await supabase.rpc('get_filtered_orders');
        
        if (error) throw error;

        // Filter orders by date range and completed status
        const completedOrders = ordersData?.filter(order => {
          const orderDate = new Date(order.completed_at || order.created_at);
          return orderDate >= startDate && 
                 orderDate <= endDate && 
                 order.status === 'completed' &&
                 order.assignee_id;
        }) || [];

        // Calculate stats
        const totalCommission = completedOrders.reduce((sum, order) => sum + (Number(order.payout) || 0), 0);
        const serviceHours = completedOrders.reduce((sum, order) => sum + (order.duration_minutes || 0), 0) / 60;

        // Generate chart data based on period
        const chartData = generateChartData(completedOrders, period, startDate, endDate);

        setData({
          stats: {
            totalCommission,
            completedOrders: completedOrders.length,
            serviceHours: Math.round(serviceHours * 10) / 10,
            averageRating: 4.9, // This would come from a ratings table in a real app
            onTimeRate: 98, // This would be calculated from order timestamps
            baseSalary: 3500,
          },
          chartData,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching income data:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load income data',
        }));
      }
    };

    fetchIncomeData();
  }, [period, selectedDate]);

  return data;
}

function generateChartData(
  orders: any[], 
  period: TimePeriod, 
  startDate: Date, 
  endDate: Date
): Array<{ date: string; commission: number; orders: number }> {
  const dataMap = new Map<string, { commission: number; orders: number }>();

  // Initialize all dates in range with zero values
  const dates = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    let key: string;
    if (period === 'day') {
      key = format(currentDate, 'HH:mm');
      // For day view, show hourly data
      for (let hour = 0; hour < 24; hour += 4) {
        const hourKey = `${hour.toString().padStart(2, '0')}:00`;
        dataMap.set(hourKey, { commission: 0, orders: 0 });
      }
      break;
    } else if (period === 'month') {
      key = format(currentDate, 'MM/dd');
    } else {
      key = format(currentDate, 'MMM');
    }
    
    dataMap.set(key, { commission: 0, orders: 0 });
    
    if (period === 'month') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (period === 'year') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  // Aggregate order data
  orders.forEach(order => {
    const orderDate = new Date(order.completed_at || order.created_at);
    let key: string;
    
    if (period === 'day') {
      const hour = Math.floor(orderDate.getHours() / 4) * 4;
      key = `${hour.toString().padStart(2, '0')}:00`;
    } else if (period === 'month') {
      key = format(orderDate, 'MM/dd');
    } else {
      key = format(orderDate, 'MMM');
    }
    
    const existing = dataMap.get(key) || { commission: 0, orders: 0 };
    dataMap.set(key, {
      commission: existing.commission + (Number(order.payout) || 0),
      orders: existing.orders + 1,
    });
  });

  return Array.from(dataMap.entries()).map(([date, data]) => ({
    date,
    ...data,
  }));
}