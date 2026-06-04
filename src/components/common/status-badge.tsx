'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  // Auto-detect variant based on status string if variant is not explicitly provided
  const getVariant = (): StatusVariant => {
    if (variant) return variant;
    const lower = status.toLowerCase();
    if (
      ['active', 'success', 'approved', 'paid', 'completed', 'verified', 'true', 'yes'].includes(
        lower,
      )
    ) {
      return 'success';
    }
    if (['pending', 'warning', 'hold', 'progress', 'partial'].includes(lower)) {
      return 'warning';
    }
    if (
      ['inactive', 'failed', 'error', 'rejected', 'cancelled', 'inactive', 'false', 'no'].includes(
        lower,
      )
    ) {
      return 'error';
    }
    if (['info', 'new', 'draft', 'scheduled'].includes(lower)) {
      return 'info';
    }
    return 'neutral';
  };

  const currentVariant = getVariant();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors select-none',
        {
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400':
            currentVariant === 'success',
          'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400':
            currentVariant === 'warning',
          'border-red-500/20 bg-red-500/10 text-red-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400':
            currentVariant === 'error',
          'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400':
            currentVariant === 'info',
          'bg-muted/80 text-muted-foreground border-border/50': currentVariant === 'neutral',
        },
        className,
      )}
    >
      {status}
    </span>
  );
}
