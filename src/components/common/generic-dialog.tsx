'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DialogAction {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'success'
    | 'danger'
    | 'primary';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  form?: string;
}

export interface GenericDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: DialogAction[];
  className?: string;
}

export default function GenericDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions = [],
  className,
}: GenericDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className={cn('border-border/60 bg-popover text-foreground max-w-lg', className)}
        {...(!description && { 'aria-describedby': undefined })}
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold tracking-tight">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground text-sm">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && <div className="py-2">{children}</div>}

        {actions.length > 0 && (
          <DialogFooter className="border-border/30 flex items-center justify-end gap-2 border-t pt-4">
            {actions.map((action, index) => {
              // Map custom/semantic variants to shadcn button variants if needed
              let btnVariant: any = action.variant || 'default';
              if (btnVariant === 'success') btnVariant = 'default'; // Success styling can be handled via action.className or custom buttons
              if (btnVariant === 'danger') btnVariant = 'destructive';
              if (btnVariant === 'primary') btnVariant = 'default';

              return (
                <Button
                  key={index}
                  type={action.type || 'button'}
                  form={action.form}
                  variant={btnVariant}
                  disabled={action.disabled || action.loading}
                  onClick={action.onClick}
                  className={cn(
                    action.variant === 'success' &&
                      'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600',
                    action.variant === 'primary' &&
                      'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
                    action.className,
                  )}
                >
                  {action.loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {action.label}
                    </span>
                  ) : (
                    action.label
                  )}
                </Button>
              );
            })}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
