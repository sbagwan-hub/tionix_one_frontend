'use client';

import React from 'react';
import { UserCheck, Server, Building2, Calendar, Clock, Sparkles, HelpCircle } from 'lucide-react';
import { useCurrentDateTime } from '@/hooks/use-current-date-time';
import { useMounted } from '@/hooks/use-mounted';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

function Footer() {
  const mounted = useMounted();
  const { date, time } = useCurrentDateTime();

  return (
    <footer className="border-border bg-card text-muted-foreground text-xxs flex h-7 items-center justify-between border-t px-3 font-medium shadow-inner select-none">
      {/* System details */}
      <div className="flex items-center gap-3.5 truncate">
        <div className="flex items-center gap-1.5 truncate" title="Unit">
          <Building2 className="text-muted-foreground/60 h-3 w-3 shrink-0" />
          <span className="text-foreground truncate font-mono">KAMDHENU COM</span>
        </div>

        <div className="bg-border/50 h-3 w-[1px] shrink-0" />

        <div className="flex items-center gap-1.5 truncate" title="Server">
          <Server className="text-muted-foreground/60 h-3 w-3 shrink-0" />
          <span className="text-foreground truncate font-mono">EARTH\AAASOLUTI</span>
        </div>

        <div className="bg-border/50 h-3 w-[1px] shrink-0" />

        <div className="flex items-center gap-1.5 truncate" title="Book">
          <Sparkles className="text-brand/70 h-3 w-3 shrink-0 animate-pulse" />
          <span className="text-brand truncate font-mono font-semibold">
            FALCON MATERIAL HANDLING
          </span>
        </div>

        <div className="bg-border/50 h-3 w-[1px] shrink-0" />

        <div className="flex items-center gap-1.5 truncate" title="User">
          <UserCheck className="text-muted-foreground/60 h-3 w-3 shrink-0" />
          <span className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold">
            SUPERVISOR
          </span>
        </div>
      </div>

      {/* Date, Time, and Help */}
      <div className="flex shrink-0 items-center gap-3 pl-3">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-muted/80 text-muted-foreground hover:text-foreground flex h-5 cursor-pointer items-center gap-1 rounded px-1.5 transition-colors focus:outline-none">
              <HelpCircle className="h-3 w-3" />
              <span>Help</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="top"
            className="border-border bg-popover text-popover-foreground w-40 border p-1 shadow-md"
          >
            <DropdownMenuItem asChild className="cursor-pointer text-xs">
              <Link href="/documentation" className="flex items-center gap-2">
                <span>Documentation</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log('About app')}
              className="cursor-pointer text-xs"
            >
              About
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="bg-border/50 h-3 w-[1px] shrink-0" />

        <span className="bg-muted text-muted-foreground border-border/50 rounded px-1.5 py-0.5 font-mono text-[9px] leading-none font-semibold">
          v2026.01
        </span>
        <div className="bg-border/50 h-3 w-[1px] shrink-0" />
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 opacity-60" />
          <span className="text-foreground/80 font-mono">{date}</span>
        </div>
        <div className="bg-border/50 h-3 w-[1px] shrink-0" />
        <div className="text-foreground flex items-center gap-1.5 font-semibold">
          <Clock className="text-brand/80 h-3 w-3" />
          {mounted && <span className="font-mono">{time}</span>}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
