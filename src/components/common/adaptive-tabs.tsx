'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdaptiveTabsOption {
  label: string;
  value: string;
}

interface AdaptiveTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  label?: string;
  options: AdaptiveTabsOption[];
  required?: boolean;
  className?: string;
}

const AdaptiveTabs = React.forwardRef<HTMLDivElement, AdaptiveTabsProps>(
  ({ label, value, onValueChange, options = [], required = false, className, ...props }, ref) => {
    const totalOptions = options.length;

    return (
      <div ref={ref} className={cn('flex w-full min-w-0 flex-col gap-1.5', className)}>
        {/* Label Block */}
        {label && (
          <Label className="text-muted-foreground block text-xs font-medium tracking-tight select-none">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        {/* Core Tabs Control Node */}
        <Tabs value={value} onValueChange={onValueChange} className="w-full" {...props}>
          <TabsList
            className="border-border/80 bg-muted/40 grid h-8 w-full items-center rounded-md border p-0.5 shadow-none"
            style={{
              gridTemplateColumns:
                totalOptions > 6
                  ? 'repeat(auto-fit, minmax(0, 1fr))'
                  : `repeat(${totalOptions || 1}, minmax(0, 1fr))`,
            }}
          >
            {options.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className={cn(
                  'h-full w-full cursor-pointer truncate rounded-sm px-1 text-xs font-medium tracking-tight shadow-none transition-all',
                  'flex items-center justify-center text-center', // Explicit layout centering alignment flags
                  'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-border/60 data-[state=active]:border data-[state=active]:shadow-none',
                )}
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    );
  },
);

AdaptiveTabs.displayName = 'AdaptiveTabs';

export default AdaptiveTabs;
