'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { LucideIcon } from '@/components/shared/lucide-icon'; // Imported your new component

export interface MenuItem {
  key?: string;
  shortcut?: string;
  separator?: boolean;
  children?: MenuItem[];
  href?: string;
  action?: () => void;
  icon?: string; // Extended to accept the dynamic icon string name
}

interface NavbarMenuProps {
  label: string;
  items: MenuItem[];
}

function RenderMenuItems({ items }: { items: MenuItem[] }) {
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
    <>
      {items.map((item, idx) => {
        // --- Separator ---
        if (item.separator) {
          return <DropdownMenuSeparator key={`sep-${idx}`} className="bg-border/40 my-1" />;
        }

        const hasChildren = !!item.children?.length;
        const displayLabel = item.key ? t(item.key) : '';

        // --- Cascading Submenu Layer ---
        if (hasChildren) {
          return (
            <DropdownMenuSub key={item.key ?? idx}>
              <DropdownMenuSubTrigger
                className={cn(
                  'text-foreground flex cursor-default items-center rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors outline-none select-none',
                  'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
                )}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <LucideIcon name={item.icon} className="h-3.5 w-3.5 opacity-60" />}
                  <span>{displayLabel}</span>
                </div>
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  className={cn(
                    'border-border/40 bg-popover text-popover-foreground min-w-[14rem] rounded-md border p-1 shadow-none',
                    'animate-in fade-in-50 slide-in-from-left-1 duration-100',
                  )}
                >
                  <RenderMenuItems items={item.children || []} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          );
        }

        // --- Action Item ---
        return (
          <DropdownMenuItem
            key={item.key ?? idx}
            onClick={() => handleClick(item)}
            className={cn(
              'text-foreground flex cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors outline-none select-none',
              'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
            )}
          >
            <div className="flex items-center gap-2">
              {item.icon && <LucideIcon name={item.icon} className="h-3.5 w-3.5 opacity-60" />}
              <span>{displayLabel}</span>
            </div>
            {item.shortcut && (
              <kbd className="bg-muted/60 text-foreground/80 pointer-events-none ml-auto inline-flex h-4 items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium tracking-wider select-none">
                {item.shortcut}
              </kbd>
            )}
          </DropdownMenuItem>
        );
      })}
    </>
  );
}

export function NavbarMenu({ label, items }: NavbarMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          'text-foreground inline-flex h-9 items-center justify-center rounded-md bg-transparent px-4 py-2 text-xs font-medium transition-colors outline-none select-none',
          'hover:bg-accent/40 hover:text-foreground',
          'data-[state=open]:bg-accent/50 data-[state=open]:text-foreground',
          'focus:bg-accent/40 focus:text-foreground cursor-pointer',
        )}
      >
        {label}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className={cn(
          'border-border/40 bg-popover text-popover-foreground min-w-[16rem] rounded-md border p-1 shadow-none',
          'animate-in fade-in-50 slide-in-from-top-1 duration-150',
        )}
      >
        <RenderMenuItems items={items} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
