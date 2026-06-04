'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  absolute?: boolean; // Set false for container-bounded loaders
}

export function LoadingOverlay({
  visible,
  message = 'Loading...',
  absolute = true,
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'bg-background/80 z-50 flex flex-col items-center justify-center gap-3 backdrop-blur-xs transition-opacity duration-300',
        {
          'fixed inset-0': absolute,
          'absolute inset-0 h-full min-h-[150px] w-full': !absolute,
        },
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center">
        <svg
          className="text-primary h-8 w-8 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {message && (
        <p className="text-muted-foreground text-xs font-semibold tracking-wide">{message}</p>
      )}
    </div>
  );
}
