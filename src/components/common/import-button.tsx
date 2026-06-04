'use client';

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImportButtonProps {
  onImport: (file: File) => void;
  accept?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ImportButton({
  onImport,
  accept = '.csv, .xlsx, .xls',
  isLoading = false,
  disabled = false,
  className = '',
}: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset input value to allow the same file to be imported again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="inline-block">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={disabled || isLoading}
      />
      <Button
        variant="outline"
        onClick={handleButtonClick}
        disabled={disabled || isLoading}
        className={`h-8 gap-1.5 text-xs font-semibold ${className}`}
        type="button"
      >
        <Upload className="h-3.5 w-3.5" />
        {isLoading ? 'Importing...' : 'Import'}
      </Button>
    </div>
  );
}
