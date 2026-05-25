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
import { Button } from '@/components/ui/button';

import { ChevronDown } from 'lucide-react';
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

interface NestedDropdownMenuProps {
  label: string;
  items: MenuItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const triggerClass =
  'text-muted-foreground hover:text-foreground hover:bg-accent data-[state=open]:bg-accent inline-flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors outline-none cursor-pointer';

const contentClass =
  'border-border bg-popover animate-in fade-in-50 slide-in-from-top-1 w-80 rounded-sm border p-2';

const itemClass =
  'hover:text-foreground focus:bg-brand/60 flex cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-xs transition-colors text-black dark:text-white';

function RecursiveMenu({ items }: { items: MenuItem[] }) {
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
        if (item.separator) {
          return <DropdownMenuSeparator key={`separator-${idx}`} className="bg-border my-1" />;
        }

        if (item.children?.length) {
          return (
            <DropdownMenuSub key={item.key}>
              <DropdownMenuSubTrigger className={cn(itemClass)}>
                {t(item.key!)}
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent className={cn(contentClass)}>
                <RecursiveMenu items={item.children} />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        }

        return (
          <DropdownMenuItem
            key={item.key}
            onClick={() => handleClick(item)}
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

export function NestedDropdownMenu({ label, items, open, onOpenChange }: NestedDropdownMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(triggerClass)}
          onMouseEnter={() => onOpenChange(true)}
        >
          {label}

          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className={cn(contentClass)}
        onMouseEnter={() => onOpenChange(true)}
        onMouseLeave={() => onOpenChange(false)}
      >
        <RecursiveMenu items={items} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
