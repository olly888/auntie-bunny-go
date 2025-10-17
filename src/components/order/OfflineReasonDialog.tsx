import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface OfflineReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

export function OfflineReasonDialog({ 
  open, 
  onOpenChange, 
  onConfirm 
}: OfflineReasonDialogProps) {
  const [selectedReason, setSelectedReason] = useState("");
  
  const reasons = [
    "请假休息",
    "身体不适",
    "天气或不可抗力因素",
    "其他个人原因"
  ];
  
  const handleConfirm = () => {
    if (!selectedReason) {
      toast.error("请选择下线原因");
      return;
    }
    onConfirm(selectedReason);
    setSelectedReason("");
  };

  const handleCancel = () => {
    setSelectedReason("");
    onOpenChange(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认下线</AlertDialogTitle>
          <AlertDialogDescription>
            请选择您的下线原因，以便平台更好地为您服务
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
          {reasons.map((reason) => (
            <div key={reason} className="flex items-center space-x-2">
              <RadioGroupItem value={reason} id={reason} />
              <Label htmlFor={reason} className="cursor-pointer">{reason}</Label>
            </div>
          ))}
        </RadioGroup>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            确认下线
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
