'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAV_MENUS } from '@/constants/navbar.constant';
import { useMounted } from '@/hooks/use-mounted';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LOCAL_IMAGE } from '@/constants/images.constant';
import { SelectDropDown } from '../shared/select-drop-down';
import { ThemeSwitcher } from '../shared/theme-switcher';
import { NavbarMenu } from '../shared/nested-dropdown-menu';

function Navbar() {
  const { t, i18n } = useTranslation();
  const mounted = useMounted();
  const router = useRouter();

  return (
    <div className="border-border bg-background flex w-full flex-col border-b select-none">
      {/* Meta Header */}
      <header className="border-border/40 flex h-7 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <div
            className="group flex cursor-pointer items-center gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <div className="transition-transform duration-200 group-hover:scale-102">
              <Image
                src={LOCAL_IMAGE.APP_LOGO_TRANSPARENT}
                alt="Tionix_Logo"
                className="h-auto w-12 object-contain"
              />
            </div>
            <span className="text-foreground/90 text-xs font-semibold tracking-tight">
              Tionix One
            </span>
            <span className="bg-muted text-muted-foreground border-border/60 scale-95 rounded border px-1 py-0.5 font-mono text-[9px] leading-none tracking-tight">
              v2026.01
            </span>
          </div>

          <span className="bg-border/60 h-2.5 w-px" />

          <p className="text-muted-foreground text-[10px] font-medium tracking-tight">
            {t('licensedTo')}:{' '}
            <span className="text-foreground/80 font-semibold">
              {t('FALCON MATERIAL HANDLING FZ LLC')}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* System Live Indicator */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-2 py-0.5 text-[10px] font-medium tracking-tight text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-1 w-1">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1 w-1 rounded-full bg-emerald-500"></span>
            </span>
            {t('systemLive')}
          </div>

          {mounted && (
            <div className="origin-right scale-85 opacity-90 transition-opacity hover:opacity-100">
              <ThemeSwitcher />
            </div>
          )}
        </div>
      </header>

      {/* Main Bar */}
      <section className="flex h-10 items-center justify-between px-3">
        {/* Navigation Menus */}
        <nav className="flex items-center gap-0.5">
          {NAV_MENUS.map((menu) => (
            <NavbarMenu key={menu.key} label={t(menu.key)} items={menu.items} />
          ))}
        </nav>

        {/* Global Select Utilities */}
        <div className="flex origin-right scale-95 items-center gap-1.5">
          <SelectDropDown
            label={t('language')}
            value={i18n.language}
            options={[
              { label: 'English', value: 'en' },
              { label: 'العربية', value: 'ar' },
              { label: 'हिन्दी', value: 'hi' },
            ]}
            onChange={(lang) => {
              i18n.changeLanguage(lang);
              localStorage.setItem('lang', lang);
            }}
            selectContentClassName="w-36"
          />
          <SelectDropDown
            label={t('format')}
            value="pdf"
            width="w-20"
            options={[
              { label: 'PDF', value: 'pdf' },
              { label: 'Excel', value: 'excel' },
            ]}
            selectContentClassName="w-24"
          />
          <SelectDropDown
            label={t('financialYear')}
            value="2025/04 - 2026/03"
            width="w-36"
            options={[
              { label: '2025/04 - 2026/03', value: '2025/04 - 2026/03' },
              { label: '2024/04 - 2025/03', value: '2024/04 - 2025/03' },
            ]}
            selectContentClassName="w-40"
          />
        </div>
      </section>
    </div>
  );
}

export default Navbar;
