'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export interface MenuItem {
  key?: string;
  shortcut?: string;
  separator?: boolean;
  children?: MenuItem[];
  href?: string;
  action?: () => void;
}

interface NavbarMenuProps {
  label: string;
  items: MenuItem[];
}

function RecursiveSubMenu({ items }: { items: MenuItem[] }) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleClick = (item: MenuItem) => {
    if (item.href) {
      router.push(item.href);
      return;
    }
    item.action?.();
  };

  return (
    <ul className="flex min-w-70 flex-col gap-0.5 p-1.5">
      {items.map((item, idx) => {
        if (item.separator) {
          return <hr key={`sep-${idx}`} className="border-border my-1" />;
        }

        const hasChildren = !!item.children?.length;

        if (hasChildren) {
          return (
            <li key={item.key} className="group/sub relative">
              <div className="text-muted-foreground hover:text-foreground hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors">
                <span>{t(item.key!)}</span>
                <ChevronRight className="h-3 w-3 opacity-60" />
              </div>
              {/* Nested flyout panel */}
              <div className="border-border bg-popover animate-in fade-in-50 absolute top-0 left-full ml-1 hidden min-w-50 rounded-md border p-1 shadow-md duration-150 group-hover/sub:block">
                <RecursiveSubMenu items={item.children!} />
              </div>
            </li>
          );
        }

        return (
          <li key={item.key}>
            <button
              onClick={() => handleClick(item)}
              className="text-muted-foreground hover:text-foreground hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-xs font-medium transition-colors"
            >
              <span>{t(item.key!)}</span>
              {item.shortcut && (
                <span className="text-xxs ml-4 font-mono tracking-widest opacity-50">
                  {item.shortcut}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function NavbarMenu({ label, items }: NavbarMenuProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground data-[state=open]:text-foreground hover:bg-accent/50 h-8 bg-transparent px-3 text-xs font-medium transition-colors data-active:bg-transparent data-[state=open]:bg-transparent">
            {label}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="border-border bg-popover rounded-md border shadow-md">
            <RecursiveSubMenu items={items} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
