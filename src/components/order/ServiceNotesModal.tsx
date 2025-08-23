import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ServiceNotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  customerPhone: string;
  onComplete: () => void;
}

const ServiceNotesModal = ({ open, onOpenChange, orderId, customerPhone, onComplete }: ServiceNotesModalProps) => {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      handleSkip();
      return;
    }

    setSubmitting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('用户未登录');

      const { error } = await supabase
        .from('customer_notes')
        .insert({
          order_id: orderId,
          customer_phone: customerPhone,
          author_id: user.user.id,
          content: notes.trim()
        });

      if (error) throw error;

      toast({
        title: "小贴士已保存",
        description: "感谢您为下一位同事留下宝贵经验！",
      });

      onOpenChange(false);
      onComplete();

    } catch (error) {
      console.error('Submit notes error:', error);
      toast({
        title: "保存失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            服务已完成！
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-medium">辛苦啦！</p>
            <p className="text-sm text-muted-foreground">
              方便为下一位同事留下一些服务小贴士吗？
            </p>
          </div>

          <Textarea
            placeholder="例如：用户家的清洁工具在哪？用户有哪些特别的偏好？..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="resize-none"
          />

          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleSkip}
              disabled={submitting}
            >
              跳过
            </Button>
            <Button 
              className="flex-1"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "保存中..." : "提交并返回"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceNotesModal;