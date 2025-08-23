
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TodayStats {
  completed: number;
  earnings: number;
  workHours: number;
  rating: number;
}

export const useTodayStats = () => {
  return useQuery({
    queryKey: ['today-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // 未登录时返回空统计
        return {
          completed: 0,
          earnings: 0,
          workHours: 0,
          rating: 100
        } as TodayStats;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('orders')
        .select('payout, duration_minutes, completed_at')
        .eq('assignee_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', today.toISOString())
        .lt('completed_at', tomorrow.toISOString());

      if (error) throw error;

      const completed = data.length;
      const earnings = data.reduce((sum, order) => sum + (order.payout || 0), 0);
      const workHours = Math.round(data.reduce((sum, order) => sum + (order.duration_minutes || 0), 0) / 60 * 10) / 10;

      return {
        completed,
        earnings,
        workHours,
        rating: 100 // Mock rating for now
      } as TodayStats;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
