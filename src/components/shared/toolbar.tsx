'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type Action = {
  label?: string;
  icon: React.ElementType;
  title?: string;
  onClick?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'icon';
  disabled?: boolean;
};

type ToolbarProps = {
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
  icon: 'ghost',
};

function ToolbarButton({ action, compactIcon }: { action: Action; compactIcon?: boolean }) {
  const Icon = action.icon;
  const isIconVariant = action.variant === 'icon' || compactIcon;

  const variant = action.variant ? variantMap[action.variant] : 'secondary';
  const size = isIconVariant && !action.label ? 'icon' : 'sm';

  return (
    <Button
      type="button"
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
  navigation = [],
  actions = [],
  utilities = [],
  className,
}: ToolbarProps) {
  const hasNavigation = navigation.length > 0;
  const hasActions = actions.length > 0;
  const hasUtilities = utilities.length > 0;

  return (
    <div
      className={cn(
        'bg-muted/40 border-border/60 mb-2 flex min-h-9 w-full items-center justify-between gap-1 rounded-md border p-1 dark:bg-zinc-900/40',
        className,
      )}
    >
      {/* Left side: Navigation & Actions grouped together */}
      <div className="flex items-center gap-1">
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
        <div className="flex items-center gap-1">
          {/* Separator before Utilities if there's content on the left */}
          {(hasNavigation || hasActions) && (
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
