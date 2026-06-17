'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface PhotoSectionProps {
  photo?: string | null;
  onInputChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export const PhotoSection: React.FC<PhotoSectionProps> = ({
  photo,
  onInputChange,
  disabled = false,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onInputChange('photo', event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="border-border/80 bg-background/50 space-y-3 rounded-sm border p-4 text-center">
      <Label className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase">
        PHOTOGRAPH
      </Label>
      <div className="border-border/100 bg-background relative mx-auto flex h-36 w-32 items-center justify-center overflow-hidden rounded-md border border-dashed">
        {photo ? (
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
          disabled={disabled}
        />
      </div>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="xs"
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer"
        >
          Select
        </Button>
        <Button
          variant="outline"
          size="xs"
          type="button"
          disabled={disabled}
          onClick={() => onInputChange('photo', null)}
          className="text-destructive hover:bg-destructive/10 cursor-pointer"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
