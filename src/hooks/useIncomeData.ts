import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay, startOfYear, endOfYear } from 'date-fns';

export type TimePeriod = 'day' | 'month' | 'year';

export interface IncomeStats {
  totalCommission: number;
  completedOrders: number;
  serviceHours: number;
  averageArrivalMinutes: number;
}

export interface IncomeData {
  stats: IncomeStats;
  isLoading: boolean;
  error: string | null;
}

export function useIncomeData(period: TimePeriod, selectedDate: Date): IncomeData {
  const [data, setData] = useState<IncomeData>({
    stats: {
      totalCommission: 0,
      completedOrders: 0,
      serviceHours: 0,
      averageArrivalMinutes: 15,
    },
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
        const averageArrivalMinutes = completedOrders.length > 0 
          ? Math.round(completedOrders.reduce((sum, order) => sum + (order.distance_minutes || 15), 0) / completedOrders.length)
          : 15;

        setData({
          stats: {
            totalCommission,
            completedOrders: completedOrders.length,
            serviceHours: Math.round(serviceHours * 10) / 10,
            averageArrivalMinutes,
          },
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