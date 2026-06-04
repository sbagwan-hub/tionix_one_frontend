'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PermissionTabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

const PermissionTabs = ({ tabs, activeTab, setActiveTab, className }: PermissionTabsProps) => {
  return (
    <div
      className={cn(
        'border-border bg-muted flex h-8 w-full items-center gap-1 border-b px-4 select-none',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'transiion-colors m-2 h-full cursor-pointer rounded-xs px-3 text-xs font-medium tracking-tight outline-none',
              isActive
                ? 'bg-background text-foreground border-border/80 border font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default React.memo(PermissionTabs);
