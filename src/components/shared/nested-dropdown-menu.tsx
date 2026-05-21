'use client';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface MenuItem {
  key?: string;
  shortcut?: string;
  separator?: boolean;
  children?: MenuItem[];
}

interface NestedDropdownMenuProps {
  label: string;
  items: MenuItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction?: (key: string) => void;
}

const triggerClass =
  'text-muted-foreground hover:text-foreground hover:bg-accent data-[state=open]:bg-accent inline-flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors outline-none';

const contentClass =
  'border-border bg-popover animate-in fade-in-50 slide-in-from-top-1 w-80 rounded-sm border p-2';

const itemClass =
  'hover:text-foreground focus:bg-brand/60 flex cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-xs transition-colors text-black dark:text-white';

function RecursiveMenu({
  items,
  onAction,
}: {
  items: MenuItem[];
  onAction?: (key: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      {items.map((item, idx) => {
        if (item.separator) {
          return <DropdownMenuSeparator key={idx} className="bg-border my-1" />;
        }

        if (item.children?.length) {
          return (
            <DropdownMenuSub key={item.key}>
              <DropdownMenuSubTrigger className={cn(itemClass)}>
                {t(item.key!)}
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent className={cn(contentClass)}>
                <RecursiveMenu items={item.children} onAction={onAction} />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        }

        return (
          <DropdownMenuItem
            key={item.key}
            onClick={() => item.key && onAction?.(item.key)}
            className={cn(itemClass)}
          >
            <span>{t(item.key!)}</span>

            {item.shortcut && (
              <span className="text-xxs ml-4 font-mono tracking-widest opacity-60">
                {item.shortcut}
              </span>
            )}
          </DropdownMenuItem>
        );
      })}
    </>
  );
}

export function NestedDropdownMenu({
  label,
  items,
  open,
  onOpenChange,
  onAction,
}: NestedDropdownMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button onMouseEnter={() => onOpenChange(true)} className={cn(triggerClass)}>
          {label}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        onMouseEnter={() => onOpenChange(true)}
        onMouseLeave={() => onOpenChange(false)}
        className={cn(contentClass)}
      >
        <RecursiveMenu items={items} onAction={onAction} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
