'use client';

import React, { useEffect } from 'react';
import { AlertCircle, Trash2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
  confirmText?: string;
  deletingText?: string;
  cancelText?: string;
  zIndex?: string;
  icon?: React.ReactNode;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete permanently?',
  description = 'This action is final and cannot be undone. All associated data will be removed.',
  itemName,
  isDeleting = false,
  confirmText = 'Confirm Delete',
  deletingText = 'Deleting...',
  cancelText = 'Cancel',
  zIndex = 'z-[9999]',
  icon = <AlertCircle className="h-5 w-5 stroke-[2]" />,
}: DeleteDialogProps) {
  // Prevent scrolling behind modal & listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`animate-in fade-in fixed inset-0 ${zIndex} flex items-center justify-center p-4 duration-200 select-none sm:p-6`}
    >
      {/* Universal Premium Dark Mask Backdrop (Beautiful in both themes) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 dark:bg-black/80"
        onClick={() => !isDeleting && onClose()}
      />

      {/* Theme-Adaptive Premium Plate Container */}
      <div
        className="border-border bg-background animate-in zoom-in-95 slide-in-from-bottom-2 ring-foreground/[0.02] relative w-full max-w-md transform overflow-hidden rounded-xl border p-6 text-left shadow-2xl ring-1 transition-all duration-300 dark:ring-white/[0.04]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Deep Ruby Neon Line Anchor */}
        <div className="via-destructive/40 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />

        {/* Minimalist Floating Close Cross */}
        <button
          type="button"
          onClick={onClose}
          className="text-foreground hover:bg-muted hover:text-foreground focus:ring-ring absolute top-4 right-4 rounded-lg p-1.5 opacity-70 transition-all focus:ring-1 focus:outline-none"
          disabled={isDeleting}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Left-Aligned Context Header */}
        <div className="flex items-start gap-4">
          <div className="bg-destructive/10 border-destructive/20 text-destructive flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
            {icon}
          </div>

          <div className="flex-1 space-y-1.5 pr-4">
            <h2
              id="modal-title"
              className="text-foreground text-lg leading-none font-semibold tracking-tight"
            >
              {title}
            </h2>
            <p id="modal-description" className="text-foreground text-xs leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Targeted Item Micro-Block (Adapts to Dark/Light seamlessly) */}
        {itemName && (
          <div className="border-border bg-muted/40 dark:bg-muted/20 mt-4 space-y-1 rounded-lg border p-3.5">
            <span className="text-foreground block text-[10px] font-bold tracking-widest uppercase">
              Target Entity
            </span>
            <p className="text-destructive truncate font-mono text-xs font-semibold tracking-wide dark:text-red-400">
              {itemName}
            </p>
          </div>
        )}

        {/* Control Footer Action Strip */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="text-foreground hover:text-foreground bg-background border-border h-9 w-full px-4 text-xs font-medium transition-colors duration-200 sm:w-auto"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md px-4 text-xs font-medium shadow-sm transition-all duration-200 disabled:opacity-50 sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{deletingText}</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>{confirmText}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
