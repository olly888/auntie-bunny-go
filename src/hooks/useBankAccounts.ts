
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BankAccount {
  id: string;
  owner_profile_id: string;
  bank_name: string;
  account_holder: string;
  account_number_last4: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useBankAccounts = () => {
  return useQuery({
    queryKey: ['bank-accounts'],
    queryFn: async () => {
      console.log('Fetching bank accounts...');
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bank accounts:', error);
        throw error;
      }

      console.log('Bank accounts fetched:', data);
      return data as BankAccount[];
    },
  });
};

export const useAddBankAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bankData: {
      bank_name: string;
      account_holder: string;
      account_number: string;
      is_default?: boolean;
    }) => {
      console.log('Adding bank account:', bankData);
      
      // Get current user's profile ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // If setting as default, first unset any existing default
      if (bankData.is_default) {
        await supabase
          .from('bank_accounts')
          .update({ is_default: false })
          .eq('owner_profile_id', user.id);
      }

      // SECURITY: Validate account number format
      const accountNumber = bankData.account_number;
      if (!/^\d{10,30}$/.test(accountNumber)) {
        throw new Error('Invalid account number format');
      }
      
      // SECURITY: Extract last 4 digits immediately, never send full number
      const last4 = accountNumber.slice(-4);
      
      // Insert new bank account (only save last 4 digits)
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert({
          owner_profile_id: user.id,
          bank_name: bankData.bank_name,
          account_holder: bankData.account_holder,
          account_number_last4: last4,
          is_default: bankData.is_default || false,
        })
        .select()
        .single();

      if (error) {
        // SECURITY: Don't log sensitive data in production
        if (import.meta.env.DEV) {
          console.error('Error adding bank account:', error);
        }
        throw error;
      }

      console.log('Bank account added:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
      toast({
        title: "银行卡添加成功",
        description: "您的银行卡已成功添加",
      });
    },
    onError: (error: any) => {
      console.error('Failed to add bank account:', error);
      toast({
        title: "添加失败",
        description: "银行卡添加失败，请稍后重试",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BankAccount> }) => {
      console.log('Updating bank account:', id, updates);
      
      // If setting as default, first unset any existing default
      if (updates.is_default) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('bank_accounts')
            .update({ is_default: false })
            .eq('owner_profile_id', user.id)
            .neq('id', id);
        }
      }

      const { data, error } = await supabase
        .from('bank_accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating bank account:', error);
        throw error;
      }

      console.log('Bank account updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
      toast({
        title: "更新成功",
        description: "银行卡信息已更新",
      });
    },
    onError: (error: any) => {
      console.error('Failed to update bank account:', error);
      toast({
        title: "更新失败",
        description: "银行卡更新失败，请稍后重试",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting bank account:', id);
      
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting bank account:', error);
        throw error;
      }

      console.log('Bank account deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
      toast({
        title: "删除成功",
        description: "银行卡已删除",
      });
    },
    onError: (error: any) => {
      console.error('Failed to delete bank account:', error);
      toast({
        title: "删除失败",
        description: "银行卡删除失败，请稍后重试",
        variant: "destructive",
      });
    },
  });
};
