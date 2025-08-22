import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CreditCard, Plus, MoreVertical, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BankCard {
  id: string;
  bankName: string;
  accountNumber: string;
  holderName: string;
  isDefault: boolean;
}

const BankCards = () => {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Mock data - will be replaced with real data
  const [bankCards, setBankCards] = useState<BankCard[]>([
    {
      id: "1",
      bankName: "中国工商银行",
      accountNumber: "**** **** **** 1234",
      holderName: "张三",
      isDefault: true
    },
    {
      id: "2", 
      bankName: "中国建设银行",
      accountNumber: "**** **** **** 5678",
      holderName: "张三",
      isDefault: false
    }
  ]);

  const [newCard, setNewCard] = useState({
    bankName: "",
    accountNumber: "",
    holderName: "",
    phone: ""
  });

  const handleAddCard = () => {
    // Validate form
    if (!newCard.bankName || !newCard.accountNumber || !newCard.holderName) {
      alert('请填写完整信息');
      return;
    }

    // Add new card (mock implementation)
    const card: BankCard = {
      id: Date.now().toString(),
      bankName: newCard.bankName,
      accountNumber: `**** **** **** ${newCard.accountNumber.slice(-4)}`,
      holderName: newCard.holderName,
      isDefault: bankCards.length === 0
    };

    setBankCards([...bankCards, card]);
    setNewCard({ bankName: "", accountNumber: "", holderName: "", phone: "" });
    setShowAddDialog(false);
  };

  const handleSetDefault = (cardId: string) => {
    setBankCards(cards => 
      cards.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
  };

  const handleDeleteCard = (cardId: string) => {
    if (bankCards.find(card => card.id === cardId)?.isDefault && bankCards.length > 1) {
      alert('请先设置其他银行卡为默认卡');
      return;
    }
    setBankCards(cards => cards.filter(card => card.id !== cardId));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* 页面标题 */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">我的银行卡</h1>
        </div>

        {/* 添加银行卡按钮 */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              添加银行卡
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加银行卡</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bankName">开户银行</Label>
                <Select onValueChange={(value) => setNewCard({...newCard, bankName: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择银行" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="中国工商银行">中国工商银行</SelectItem>
                    <SelectItem value="中国建设银行">中国建设银行</SelectItem>
                    <SelectItem value="中国农业银行">中国农业银行</SelectItem>
                    <SelectItem value="中国银行">中国银行</SelectItem>
                    <SelectItem value="招商银行">招商银行</SelectItem>
                    <SelectItem value="交通银行">交通银行</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="accountNumber">卡号</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="请输入银行卡号"
                  value={newCard.accountNumber}
                  onChange={(e) => setNewCard({...newCard, accountNumber: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="holderName">持卡人姓名</Label>
                <Input
                  id="holderName"
                  type="text"
                  placeholder="请输入持卡人姓名"
                  value={newCard.holderName}
                  onChange={(e) => setNewCard({...newCard, holderName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入预留手机号"
                  value={newCard.phone}
                  onChange={(e) => setNewCard({...newCard, phone: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  取消
                </Button>
                <Button onClick={handleAddCard} className="flex-1">
                  确认添加
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 银行卡列表 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">我的银行卡</h2>
          
          {bankCards.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">暂无银行卡</p>
              <p className="text-sm mt-1">添加银行卡后可进行提现操作</p>
            </Card>
          ) : (
            bankCards.map((card) => (
              <Card key={card.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-primary rounded flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{card.bankName}</span>
                        {card.isDefault && (
                          <Badge variant="default" className="text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            默认
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{card.accountNumber}</div>
                      <div className="text-sm text-muted-foreground">{card.holderName}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!card.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(card.id)}
                      >
                        设为默认
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* 提示信息 */}
        <Card className="p-4 bg-muted/50">
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="font-medium text-foreground">温馨提示：</div>
            <div>• 银行卡信息经过加密存储，请放心使用</div>
            <div>• 提现只能到本人实名认证的银行卡</div>
            <div>• 如需修改银行卡信息，请删除后重新添加</div>
          </div>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default BankCards;