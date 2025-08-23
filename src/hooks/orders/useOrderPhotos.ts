import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrderPhoto {
  id: string;
  photo_url: string;
  created_at: string;
}

export const useOrderPhotos = (orderId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${orderId}/${Date.now()}.${fileExt}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('order-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('order-photos')
        .getPublicUrl(fileName);

      // Save to order_photos table
      const { error: dbError } = await supabase
        .from('order_photos')
        .insert({
          order_id: orderId,
          photo_url: publicUrl,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id!
        });

      if (dbError) throw dbError;

      toast({
        title: "照片上传成功",
        description: "服务照片已保存"
      });

      return publicUrl;
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: "上传失败",
        description: "请重试",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const getOrderPhotos = async (): Promise<OrderPhoto[]> => {
    const { data, error } = await supabase
      .from('order_photos')
      .select('id, photo_url, created_at')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
      return [];
    }

    return data || [];
  };

  return {
    uploadPhoto,
    getOrderPhotos,
    isUploading
  };
};