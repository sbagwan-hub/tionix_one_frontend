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
          <Label className="text-muted-foreground block text-xs font-medium tracking-tight">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        {/* Core Tabs Control Node */}
        <Tabs value={value} onValueChange={onValueChange} className="w-full" {...props}>
          <TabsList className="flex border-b border-border/80 bg-transparent h-auto p-0 w-full justify-start rounded-none">
            {options.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className={cn(
                  'mb-[-2px] border-b-2 px-4 py-2 text-xs font-semibold transition-all cursor-pointer rounded-none border-transparent text-foreground hover:text-foreground bg-transparent shadow-none h-auto flex items-center justify-center after:hidden',
                  'data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-muted/30 data-[state=active]:font-bold data-[state=active]:shadow-none data-[state=active]:border-b-2',
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
