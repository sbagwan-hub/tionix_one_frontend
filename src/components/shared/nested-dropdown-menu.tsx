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
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { LucideIcon } from '@/components/shared/lucide-icon';

export interface MenuItem {
  key?: string;
  shortcut?: string;
  separator?: boolean;
  children?: MenuItem[];
  href?: string;
  action?: () => void;
  icon?: string;
}

interface NavbarMenuProps {
  label: string;
  items: MenuItem[];
}

export function RenderMenuItems({ items }: { items: MenuItem[] }) {
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
          return <DropdownMenuSeparator key={`sep-${idx}`} className="bg-border/60 my-1" />;
        }

        const hasChildren = !!item.children?.length;
        const displayLabel = item.key ? t(item.key) : '';

        // --- Cascading Submenu Layer ---
        if (hasChildren) {
          return (
            <DropdownMenuSub key={item.key ?? idx}>
              <DropdownMenuSubTrigger
                className={cn(
                  'text-foreground flex cursor-default items-center rounded-sm px-2.5 py-1.5 text-[12px] font-medium transition-colors outline-none',
                  'focus:bg-secondary focus:text-secondary-foreground data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground',
                )}
              >
                <div className="flex items-center gap-2">
                  {item.icon && (
                    <LucideIcon name={item.icon} className="text-muted-foreground h-3.5 w-3.5" />
                  )}
                  <span>{displayLabel}</span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  className={cn(
                    'border-border bg-popover text-popover-foreground min-w-[14rem] rounded-md border p-1 shadow-none',
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
              'text-foreground flex cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-sm font-medium transition-colors outline-none',
              'focus:bg-secondary focus:text-secondary-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
            )}
          >
            <div className="flex items-center gap-2">
              {item.icon && (
                <LucideIcon name={item.icon} className="text-muted-foreground h-3.5 w-3.5" />
              )}
              <span>{displayLabel}</span>
            </div>
            {item.shortcut && (
              <kbd className="bg-muted text-muted-foreground text-xxs pointer-events-none ml-auto inline-flex h-4 items-center gap-1 rounded px-1.5 font-mono font-medium tracking-wider">
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
          'text-foreground inline-flex h-8 items-center justify-center rounded-md bg-transparent px-3 text-sm font-medium transition-colors outline-none',
          'hover:bg-secondary hover:text-secondary-foreground',
          'data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground',
          'focus:bg-secondary focus:text-secondary-foreground cursor-pointer',
        )}
      >
        {label}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className={cn(
          'border-border bg-popover text-popover-foreground min-w-[16rem] rounded-md border p-1 shadow-none',
          'animate-in fade-in-50 slide-in-from-top-1 duration-150',
        )}
      >
        <RenderMenuItems items={items} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
