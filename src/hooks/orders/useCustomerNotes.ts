import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomerNote {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  order_id: string;
}

export const useCustomerNotes = (customerPhone: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch customer notes
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['customer-notes', customerPhone],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_notes')
        .select('*')
        .eq('customer_phone', customerPhone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CustomerNote[];
    },
    enabled: !!customerPhone
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async ({ orderId, content }: { orderId: string; content: string }) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id!)
        .single();

      const { data, error } = await supabase
        .from('customer_notes')
        .insert({
          order_id: orderId,
          customer_phone: customerPhone,
          store_id: profile?.store_id,
          author_id: (await supabase.auth.getUser()).data.user?.id!,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-notes', customerPhone] });
      toast({
        title: "备注已保存",
        description: "您的服务备注已成功保存"
      });
    },
    onError: (error) => {
      console.error('Error adding note:', error);
      toast({
        title: "保存失败",
        description: "请重试",
        variant: "destructive"
      });
    }
  });

  return {
    notes,
    isLoading,
    addNote: addNoteMutation.mutate,
    isAddingNote: addNoteMutation.isPending
  };
};