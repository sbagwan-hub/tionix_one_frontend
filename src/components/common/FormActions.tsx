'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  onCancel?: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormActions({
  onCancel,
  onSubmit,
  submitLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  disabled = false,
  className = '',
}: FormActionsProps) {
  return (
    <div
      className={`border-border/40 mt-6 flex flex-wrap items-center justify-end gap-3 border-t pt-4 ${className}`}
    >
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || disabled}
          className="w-full sm:w-auto"
        >
          {cancelLabel}
        </Button>
      )}
      <Button
        type={onSubmit ? 'button' : 'submit'}
        onClick={onSubmit}
        disabled={isSubmitting || disabled}
        className="w-full sm:w-auto"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );
}
