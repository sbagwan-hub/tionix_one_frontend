'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type ChipVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  pulse?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function Chip({
  label,
  variant = 'neutral',
  pulse = false,
  icon: Icon,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[9px] leading-none font-semibold tracking-wider uppercase transition-all duration-200',
        {
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400':
            variant === 'success',
          'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400':
            variant === 'warning',
          'border-red-500/20 bg-red-500/10 text-red-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400':
            variant === 'error',
          'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400':
            variant === 'info',
          'border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15':
            variant === 'primary',
          'bg-muted/80 text-muted-foreground border-border/50': variant === 'neutral',
        },
        className,
      )}
    >
      {pulse && (
        <span
          className={cn('h-1 w-1 rounded-full', {
            'animate-pulse bg-emerald-500': variant === 'success',
            'animate-pulse bg-amber-500': variant === 'warning',
            'animate-pulse bg-red-500': variant === 'error',
            'animate-pulse bg-blue-500': variant === 'info',
            'bg-primary animate-pulse': variant === 'primary',
            'bg-muted-foreground': variant === 'neutral',
          })}
        />
      )}
      {Icon && <Icon className="h-3 w-3" />}
      <span>{label}</span>
    </span>
  );
}
