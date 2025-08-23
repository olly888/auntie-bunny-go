import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Upload, X, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onUploadComplete: () => void;
}

const PhotoUploadDialog = ({ open, onOpenChange, orderId, onUploadComplete }: PhotoUploadDialogProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadPromises: Promise<string>[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${orderId}/${Date.now()}-${i}.${fileExt}`;
        
        uploadPromises.push(
          new Promise(async (resolve, reject) => {
            try {
              const { data, error } = await supabase.storage
                .from('order-photos')
                .upload(fileName, file);

              if (error) throw error;

              const { data: urlData } = supabase.storage
                .from('order-photos')
                .getPublicUrl(data.path);

              resolve(urlData.publicUrl);
            } catch (err) {
              reject(err);
            }
          })
        );
      }

      const photoUrls = await Promise.all(uploadPromises);
      setUploadedFiles(photoUrls);

      // Insert photo records into database
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('用户未登录');

      const photoRecords = photoUrls.map(url => ({
        order_id: orderId,
        photo_url: url,
        uploaded_by: user.user.id
      }));

      const { error: insertError } = await (supabase as any)
        .from('order_photos')
        .insert(photoRecords);

      if (insertError) throw insertError;

      // Update order status to completed
      const { error: updateError } = await (supabase as any)
        .from('orders')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      toast({
        title: "照片上传成功",
        description: `已上传 ${photoUrls.length} 张照片`,
      });

      // Close dialog and trigger completion callback
      setTimeout(() => {
        onOpenChange(false);
        onUploadComplete();
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "上传失败，已跳过",
        description: "继续体验后续流程",
      });
      
      // For demo purposes, still proceed to completion
      setTimeout(() => {
        onOpenChange(false);
        onUploadComplete();
      }, 1500);
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSkip = async () => {
    try {
      // Update order status to completed for demo purposes
      const { error: updateError } = await (supabase as any)
        .from('orders')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Skip update error:', updateError);
      }

      toast({
        title: "已跳过照片上传",
        description: "继续体验后续流程",
      });

      onOpenChange(false);
      onUploadComplete();
    } catch (error) {
      console.error('Skip error:', error);
      // Still proceed for demo purposes
      onOpenChange(false);
      onUploadComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            上传服务照片
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
            <input
              type="file"
              id="photo-upload"
              multiple
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">点击上传照片</p>
              <p className="text-xs text-muted-foreground mt-1">
                支持多张照片，建议拍摄服务前后对比
              </p>
            </label>
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">已上传的照片：</p>
              <div className="space-y-2">
                {uploadedFiles.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm flex-1">照片 {index + 1}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeUploadedFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-b-transparent"></div>
              正在上传照片...
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              取消
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={handleSkip}
              disabled={uploading}
            >
              跳过上传（演示）
            </Button>
            {uploadedFiles.length > 0 && (
              <Button 
                className="flex-1"
                onClick={() => {
                  onOpenChange(false);
                  onUploadComplete();
                }}
              >
                完成上传
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;