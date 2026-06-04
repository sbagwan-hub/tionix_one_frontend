'use client';

import React, { useEffect } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  title?: string;
  children: React.ReactNode;
}

export function FilterDrawer({
  isOpen,
  onClose,
  onApply,
  onReset,
  title = 'Filters',
  children,
}: FilterDrawerProps) {
  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`bg-background/80 fixed inset-0 z-50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div
        className={`bg-card border-border/40 fixed top-0 right-0 bottom-0 z-50 flex h-full w-full max-w-sm flex-col border-l shadow-2xl transition-transform duration-300 select-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <header className="border-border/30 flex h-14 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Filter className="text-primary h-4 w-4" />
            <h2 className="text-foreground text-sm sm:text-base">{title}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
            type="button"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </header>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Drawer Footer Actions */}
        <footer className="bg-muted/30 border-border/30 flex items-center justify-between border-t p-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-xs font-semibold"
            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onApply();
                onClose();
              }}
              type="button"
            >
              Apply Filters
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
}
