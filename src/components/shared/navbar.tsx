'use client';

import { SelectDropDown } from './select-drop-down';
import { useTranslation } from 'react-i18next';
import { NAV_MENUS } from '@/constants/navbar.constant';
import { useMounted } from '@/hooks/use-mounted';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LOCAL_IMAGE } from '@/constants/images.constant';
import { ThemeSwitcher } from './theme-switcher';
import { NavbarMenu } from './nested-dropdown-menu';

function Navbar() {
  const { t, i18n } = useTranslation();
  const mounted = useMounted();
  const router = useRouter();

  return (
    <div className="border-border/40 bg-background flex w-full flex-col border-b select-none">
      <header className="bg-muted/30 border-border/30 flex h-9 items-center justify-between border-b px-6">
        <div className="flex items-center gap-4">
          <div
            className="group flex cursor-pointer items-center gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <div className="transition-transform duration-300 group-hover:scale-105">
              <Image
                src={LOCAL_IMAGE.APP_LOGO_TRANSPARENT}
                alt="Tionix_Logo"
                className="h-auto w-14 object-contain"
              />
            </div>
            <span className="text-foreground/90 text-xs font-semibold tracking-tight">
              Tionix One
            </span>
            <span className="bg-muted/80 text-muted-foreground border-border/50 scale-90 rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-tight">
              v2026.01
            </span>
          </div>

          <span className="bg-border/60 h-3 w-px" />

          <p className="text-muted-foreground text-[11px] font-medium tracking-wide">
            {t('licensedTo')}:{' '}
            <span className="text-foreground/80 font-semibold">
              {t('FALCON MATERIAL HANDLING FZ LLC')}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xxs inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 font-semibold tracking-wide text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            {t('systemLive')}
          </div>
          {mounted && (
            <div className="scale-90 transition-opacity hover:opacity-80">
              <ThemeSwitcher />
            </div>
          )}
        </div>
      </header>

      <section className="flex h-12 items-center justify-between px-4">
        <nav className="flex items-center gap-0.5">
          {NAV_MENUS.map((menu) => (
            <NavbarMenu key={menu.key} label={t(menu.key)} items={menu.items} />
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
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
            width="w-24"
            options={[
              { label: 'PDF', value: 'pdf' },
              { label: 'Excel', value: 'excel' },
            ]}
            selectContentClassName="w-28"
          />
          <SelectDropDown
            label={t('financialYear')}
            value="2025/04 - 2026/03"
            width="w-40"
            options={[
              { label: '2025/04 - 2026/03', value: '2025/04 - 2026/03' },
              { label: '2024/04 - 2025/03', value: '2024/04 - 2025/03' },
            ]}
            selectContentClassName="w-44"
          />
        </div>
      </section>
    </div>
  );
}

export default Navbar;
