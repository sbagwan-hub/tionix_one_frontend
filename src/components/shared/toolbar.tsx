'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

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

function ToolbarButton({ action }: { action: Action }) {
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
      disabled={action.disabled}
      className={action.variant === 'icon' ? 'dark:text-muted-foreground text-slate-500' : ''}
    >
      <Icon size={16} />
      {action.label && <span className="text-sm font-medium">{action.label}</span>}
    </Button>
  );
}

export default function Toolbar({ navigation = [], actions = [], utilities = [] }: ToolbarProps) {
  return (
    <div className="ring-border/50 dark:border-input/60 dark:bg-card bg-background border-foreground/10 mb-2 flex flex-wrap items-center justify-between gap-4 rounded-sm border p-3">
      <div className="dark:border-input/60 flex items-center gap-1 border-r border-slate-200 pr-4">
        {navigation.map((item, idx) => (
          <ToolbarButton
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
          <ToolbarButton key={idx} action={item} />
        ))}
      </div>

      <div className="dark:border-input/60 flex items-center gap-2 border-l border-slate-200 pl-4">
        {utilities.map((item, idx) => (
          <ToolbarButton
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
