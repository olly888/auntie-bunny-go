import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAddBankAccount, useUpdateBankAccount, BankAccount } from "@/hooks/useBankAccounts";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema for bank card details
const bankCardSchema = z.object({
  bank_name: z.string()
    .trim()
    .min(2, "银行名称至少需要2个字")
    .max(50, "银行名称不能超过50个字"),
  account_holder: z.string()
    .trim()
    .min(2, "持卡人姓名至少需要2个字")
    .max(30, "持卡人姓名不能超过30个字")
    .regex(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, "姓名只能包含中英文和空格"),
  account_number: z.string()
    .regex(/^\d{16,19}$/, "请输入16-19位银行卡号")
});

interface BankCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingCard?: BankAccount | null;
}

export const BankCardForm = ({ isOpen, onClose, editingCard }: BankCardFormProps) => {
  const [formData, setFormData] = useState({
    bank_name: editingCard?.bank_name || '',
    account_holder: editingCard?.account_holder || '',
    account_number: editingCard ? `****${editingCard.account_number_last4}` : '',
    is_default: editingCard?.is_default || false,
  });

  const addMutation = useAddBankAccount();
  const updateMutation = useUpdateBankAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data using Zod schema
      const validated = bankCardSchema.parse(formData);

      if (editingCard) {
        // For editing, only update name, holder, and default status
        await updateMutation.mutateAsync({
          id: editingCard.id,
          updates: {
            bank_name: validated.bank_name,
            account_holder: validated.account_holder,
            is_default: formData.is_default,
          }
        });
      } else {
        // For new cards, include full account number
        await addMutation.mutateAsync({
          bank_name: validated.bank_name,
          account_holder: validated.account_holder,
          account_number: validated.account_number,
          is_default: formData.is_default,
        });
      }
      
      onClose();
      setFormData({
        bank_name: '',
        account_holder: '',
        account_number: '',
        is_default: false,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Failed to save bank card:', error);
        toast.error("保存失败，请重试");
      }
    }
  };

  const isLoading = addMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>{editingCard ? '编辑银行卡' : '添加银行卡'}</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="bank_name">银行名称</Label>
            <Input
              id="bank_name"
              value={formData.bank_name}
              onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
              placeholder="请输入银行名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_holder">开户姓名</Label>
            <Input
              id="account_holder"
              value={formData.account_holder}
              onChange={(e) => setFormData(prev => ({ ...prev, account_holder: e.target.value }))}
              placeholder="请输入开户姓名"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_number">银行卡号</Label>
            <Input
              id="account_number"
              value={formData.account_number}
              onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
              placeholder={editingCard ? "银行卡号（不可修改）" : "请输入银行卡号"}
              disabled={!!editingCard}
              required
            />
            {editingCard && (
              <p className="text-sm text-muted-foreground">
                出于安全考虑，银行卡号不可修改
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_default">设为默认提现账户</Label>
            <Switch
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
