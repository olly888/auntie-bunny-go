
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ArrowLeft, Plus, CreditCard, MoreHorizontal, Star } from "lucide-react";
import { LoadingSkeleton } from "@/components/income/LoadingSkeleton";
import { useBankAccounts, useDeleteBankAccount, useUpdateBankAccount, BankAccount } from "@/hooks/useBankAccounts";
import { BankCardForm } from "@/components/bank-cards/BankCardForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MyBankCards = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<BankAccount | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const { data: bankAccounts, isLoading, error } = useBankAccounts();
  const deleteMutation = useDeleteBankAccount();
  const updateMutation = useUpdateBankAccount();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const handleEdit = (card: BankAccount) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeleteConfirm(null);
  };

  const handleSetDefault = async (card: BankAccount) => {
    if (!card.is_default) {
      await updateMutation.mutateAsync({
        id: card.id,
        updates: { is_default: true }
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCard(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/income')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">我的银行卡</h1>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            添加
          </Button>
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>加载银行卡列表失败，请稍后重试</AlertDescription>
          </Alert>
        )}

        {/* 银行卡列表 */}
        <div className="space-y-4">
          {bankAccounts?.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-medium text-foreground mb-2">暂无银行卡</div>
              <div className="text-sm text-muted-foreground mb-6">添加银行卡以便提现收入</div>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                添加银行卡
              </Button>
            </div>
          ) : (
            bankAccounts?.map((card) => (
              <div key={card.id} className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{card.bank_name}</span>
                        {card.is_default && (
                          <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            <Star className="w-3 h-3 fill-current" />
                            默认
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {card.account_holder}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ****{card.account_number_last4}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-2">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(card)}>
                        编辑
                      </DropdownMenuItem>
                      {!card.is_default && (
                        <DropdownMenuItem onClick={() => handleSetDefault(card)}>
                          设为默认
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => setDeleteConfirm(card.id)}
                        className="text-destructive"
                      >
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 提示信息 */}
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="text-sm text-muted-foreground">
            <div className="font-medium mb-2">提现说明：</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>提现申请将在1-3个工作日内处理</li>
              <li>单次提现最低金额为50元</li>
              <li>银行卡信息仅保存后四位数字，确保安全</li>
              <li>如需修改银行卡号，请删除后重新添加</li>
            </ul>
          </div>
        </div>
      </div>
      
      <BottomNav />

      {/* 添加/编辑表单 */}
      <BankCardForm
        isOpen={showForm}
        onClose={handleCloseForm}
        editingCard={editingCard}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这张银行卡吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyBankCards;
