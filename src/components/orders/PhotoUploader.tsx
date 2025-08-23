import React, { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderPhotos } from '@/hooks/orders/useOrderPhotos';

interface PhotoUploaderProps {
  orderId: string;
  onPhotosChange: (count: number) => void;
}

export function PhotoUploader({ orderId, onPhotosChange }: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto, isUploading } = useOrderPhotos(orderId);

  const handlePhotoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        continue;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const photoUrl = await uploadPhoto(file);
      if (photoUrl) {
        setPhotos(prev => {
          const updated = [...prev, photoUrl];
          onPhotosChange(updated.length);
          return updated;
        });
      }
    }
    
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onPhotosChange(updated.length);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">服务照片</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || photos.length >= 6}
        >
          <Camera className="w-4 h-4 mr-1" />
          {isUploading ? '上传中...' : '添加照片'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoSelect}
        className="hidden"
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={photo}
                alt={`服务照片 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">至少上传一张服务完成照片</p>
        </div>
      )}
    </div>
  );
}