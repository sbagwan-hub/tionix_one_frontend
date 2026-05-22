'use client';

import React, { useEffect, useState } from 'react';
import { UserCheck, Server, Building2, Calendar, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrentDateTime } from '@/hooks/use-current-date-time';
import { useMounted } from '@/hooks/use-mounted';

function Footer() {
  const { t } = useTranslation();
  const mounted = useMounted();
  const { date, time } = useCurrentDateTime();
  return (
    <footer className="border-border bg-card text-muted-foreground grid h-8 grid-cols-5 border-t text-[11px] font-medium shadow-inner select-none">
      <div className="border-border/60 flex items-center gap-2 border-r px-3">
        <Building2 className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0" />
        <span>{t('unit')}:</span>
        <span className="text-foreground truncate font-mono">KAMDHENU COM</span>
      </div>

      <div className="border-border/60 flex items-center gap-2 border-r px-3">
        <Server className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0" />
        <span>{t('server')}: </span>
        <span className="text-foreground truncate font-mono">EARTH\AAASOLUTI</span>
      </div>

      <div className="border-border/60 flex items-center gap-2 border-r px-3">
        <Sparkles className="text-brand/70 h-3.5 w-3.5 shrink-0" />
        <span>{t('book')}:</span>
        <span className="text-brand truncate font-mono font-semibold">
          FALCON MATERIAL HANDLING
        </span>
      </div>

      <div className="border-border/60 flex items-center gap-2 border-r px-3">
        <UserCheck className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0" />
        <span>{t('user')}: </span>
        <span className="bg-muted text-foreground text-xxs rounded px-1.5 py-0.5 font-mono font-semibold">
          SUPERVISOR
        </span>
      </div>

      <div className="bg-accent text-muted-foreground flex items-center justify-between px-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 opacity-75" />
          <span className="font-mono">
            {t('date')}: {date}
          </span>
        </div>
        <div className="text-foreground flex items-center gap-1.5 font-semibold">
          <Clock className="h-3.5 w-3.5 opacity-75" />
          {mounted && <span className="font-mono">{time}</span>}
        </div>
      </div>
    </footer>
  );
}
export default Footer;
