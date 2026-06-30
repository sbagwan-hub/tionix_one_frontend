'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type Action = {
  label?: string;
  icon: React.ElementType;
  title?: string;
  onClick?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'icon' | 'outline' | 'destructive';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
};

type ToolbarProps = {
  title?: string;
  currentRecord?: number;
  totalRecords?: number;
  navigation?: readonly Action[];
  actions?: readonly Action[];
  utilities?: readonly Action[];
  className?: string;
};

const variantMap: Record<
  NonNullable<Action['variant']>,
  React.ComponentProps<typeof Button>['variant']
> = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
  success: 'outline',
  outline: 'outline',
  destructive: 'destructive',
  icon: 'ghost',
};

function ToolbarButton({ action, compactIcon }: { action: Action; compactIcon?: boolean }) {
  const Icon = action.icon;
  const isIconVariant = action.variant === 'icon' || compactIcon;

  const variant = action.variant ? variantMap[action.variant] : 'secondary';
  const size = isIconVariant && !action.label ? 'icon' : 'sm';

  return (
    <Button
      type={action.type || 'button'}
      form={action.form}
      title={action.title}
      onClick={action.onClick}
      variant={variant}
      size={size}
      disabled={action.disabled}
      className={cn(
        'h-7 gap-1.5 rounded-sm px-2 text-xs font-medium tracking-tight',
        isIconVariant && 'text-muted-foreground hover:text-foreground hover:bg-muted h-7 w-7 p-0',
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {action.label && <span>{action.label}</span>}
    </Button>
  );
}

export default function Toolbar({
  title,
  currentRecord,
  totalRecords,
  navigation = [],
  actions = [],
  utilities = [],
  className,
}: ToolbarProps) {
  const hasNavigation = navigation.length > 0;
  const hasActions = actions.length > 0;
  const hasUtilities = utilities.length > 0;
  const showPagination =
    currentRecord !== undefined && totalRecords !== undefined && totalRecords > 0;

  return (
    <div
      className={cn(
        'bg-muted/40 border-border/60 mb-2 flex min-h-9 w-full flex-wrap items-center justify-between gap-x-1 gap-y-2 rounded-sm border p-1 dark:bg-zinc-900/40',
        className,
      )}
    >
      {/* Left side: Context (Title/Counter) -> Navigation -> Actions */}
      <div className="flex flex-wrap items-center gap-1">
        {/* Integrated Title & Counter */}
        {title && (
          <div className="flex items-center gap-2 pr-1 pl-1.5">
            <span className="text-foreground text-sm font-semibold tracking-tight whitespace-nowrap">
              {title}
            </span>
            {showPagination && (
              <span className="text-muted-foreground bg-muted border-border/40 text-xxs rounded border px-1 py-0.5 font-mono">
                {currentRecord}/{totalRecords}
              </span>
            )}
          </div>
        )}

        {/* Separator between Title Context and Buttons */}
        {title && (hasNavigation || hasActions) && (
          <div className="bg-border mx-1 h-3.5 w-[1px]" aria-hidden="true" />
        )}

        {hasNavigation && (
          <div className="flex items-center gap-1">
            {navigation.map((item, idx) => (
              <ToolbarButton key={`nav-${idx}`} action={{ ...item, variant: 'icon' }} />
            ))}
          </div>
        )}

        {/* Separator between Nav and Actions */}
        {hasNavigation && hasActions && (
          <div className="bg-border mx-1 h-3.5 w-[1px]" aria-hidden="true" />
        )}

        {hasActions && (
          <div className="flex items-center gap-1">
            {actions.map((item, idx) => (
              <ToolbarButton key={`act-${idx}`} action={item} />
            ))}
          </div>
        )}
      </div>

      {/* Right side: Utilities */}
      {hasUtilities && (
        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          {/* Separator before Utilities if there's content on the left */}
          {(title || hasNavigation || hasActions) && (
            <div className="bg-border mx-1 h-3.5 w-[1px]" aria-hidden="true" />
          )}
          {utilities.map((item, idx) => (
            <ToolbarButton key={`util-${idx}`} action={{ ...item, variant: 'icon' }} />
          ))}
        </div>
      )}
    </div>
  );
}
