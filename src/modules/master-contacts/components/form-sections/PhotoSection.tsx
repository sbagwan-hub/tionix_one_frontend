'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { uploadFileToMinio } from '@/lib/s3';
import { toast } from 'sonner';

interface PhotoSectionProps {
  photo?: string | null;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
  fieldName?: string;
}

export const PhotoSection: React.FC<PhotoSectionProps> = ({
  photo,
  onInputChange,
  disabled = false,
  fieldName = 'photo_url',
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const fileUrl = await uploadFileToMinio(file, 'individual-photo');
        onInputChange(fieldName, fileUrl);
        toast.success('Photograph uploaded successfully');
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to upload photograph. Please check your connection.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="border-border/80 bg-background/50 space-y-3 rounded-sm border p-4 text-center">
      <Label className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase">
        PHOTOGRAPH
      </Label>
      <div className="border-border/100 bg-background relative mx-auto flex h-36 w-32 items-center justify-center overflow-hidden rounded-md border border-dashed">
        {isUploading ? (
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        ) : photo ? (
          <img src={photo} alt="Contact Photo" className="h-full w-full object-cover" />
        ) : (
          <Camera className="text-muted-foreground/60 h-10 w-10" />
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={disabled || isUploading}
        />
      </div>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="xs"
          type="button"
          disabled={disabled || isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer"
        >
          Select
        </Button>
        <Button
          variant="outline"
          size="xs"
          type="button"
          disabled={disabled || isUploading}
          onClick={() => onInputChange(fieldName, null)}
          className="text-destructive hover:bg-destructive/10 cursor-pointer"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
