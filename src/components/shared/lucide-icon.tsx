'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

export type IconName = keyof typeof Icons;

interface LucideIconProps extends Omit<React.ComponentPropsWithoutRef<'svg'>, 'name'> {
  name: string;
  fallback?: IconName;
}

export function LucideIcon({
  name,
  fallback = 'HelpCircle',
  className,
  ...props
}: LucideIconProps) {
  let IconComponent = Icons[name as IconName] as React.ComponentType<
    React.ComponentPropsWithoutRef<'svg'>
  >;

  if (!IconComponent) {
    IconComponent = Icons[fallback] as React.ComponentType<React.ComponentPropsWithoutRef<'svg'>>;
  }

  return <IconComponent className={cn('h-4 w-4 shrink-0', className)} {...props} />;
}
