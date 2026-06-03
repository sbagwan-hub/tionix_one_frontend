'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import type { Action } from '@/components/shared/toolbar';
import { cn } from '@/lib/utils';
import { hrmsButtonClassName, hrmsCardClassName } from './hrms-styles';

type HrmsToolbarProps = {
  navigation?: readonly Action[];
  actions?: readonly Action[];
  utilities?: readonly Action[];
};

const variantMap: Record<
  NonNullable<Action['variant']>,
  React.ComponentProps<typeof Button>['variant']
> = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
  success: 'success',
  icon: 'ghost',
};

function HrmsToolbarButton({ action }: { action: Action }) {
  const Icon = action.icon;
  const variant = action.variant ? variantMap[action.variant] : 'secondary';
  const size = action.variant === 'icon' ? 'icon' : 'default';

  return (
    <Button
      type="button"
      title={action.title}
      onClick={action.onClick}
      variant={variant}
      size={size}
      className={cn(
        hrmsButtonClassName,
        action.variant === 'icon' ? 'dark:text-muted-foreground text-slate-500' : '',
      )}
    >
      <Icon size={16} />
      {action.label && <span className="text-sm font-medium">{action.label}</span>}
    </Button>
  );
}

export default function HrmsToolbar({
  navigation = [],
  actions = [],
  utilities = [],
}: HrmsToolbarProps) {
  return (
    <div className={cn(hrmsCardClassName, 'flex flex-wrap items-center justify-between gap-4 p-3')}>
      <div className="border-border flex items-center gap-1 border-r pr-4">
        {navigation.map((item, idx) => (
          <HrmsToolbarButton
            key={idx}
            action={{
              ...item,
              variant: 'icon',
            }}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2">
        {actions.map((item, idx) => (
          <HrmsToolbarButton key={idx} action={item} />
        ))}
      </div>

      <div className="border-border flex items-center gap-2 border-l pl-4">
        {utilities.map((item, idx) => (
          <HrmsToolbarButton
            key={idx}
            action={{
              ...item,
              variant: 'icon',
            }}
          />
        ))}
      </div>
    </div>
  );
}
