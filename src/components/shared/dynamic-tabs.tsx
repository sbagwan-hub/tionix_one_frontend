import { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface TabItem<T> {
  value: string;
  label: string;
  data: T;
}

interface DynamicTabsProps<T> {
  tabs: TabItem<T>[];
  activeTab: string;
  onTabChange: (value: string) => void;
  children: (item: TabItem<T>) => ReactNode;
  className?: string;
}

export function DynamicTabs<T>({
  tabs,
  activeTab,
  onTabChange,
  children,
  className,
}: DynamicTabsProps<T>) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className={className}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {children(tab)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
