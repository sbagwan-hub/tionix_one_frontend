'use client';

import { useState } from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';

import { SelectDropDown } from './select-drop-down';
import { useTranslation } from 'react-i18next';
import { NAV_MENUS } from '@/constants/navbar.constant';
import { NestedDropdownMenu } from './nested-dropdown-menu';
import { useMounted } from '@/hooks/use-mounted';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { findPath } from '@/lib/utils';
import { LOCAL_IMAGE } from '@/constants/images.constant';

export enum THEMES {
  LIGHT = 'light',
  DARK = 'dark',
}

function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const handleThemeChange = () => {
    const newTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const router = useRouter();

  return (
    <div className="flex w-full flex-col select-none">
      <header className="border-border bg-card flex h-9 items-center justify-between border-b px-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div
            className="text-foreground flex items-center gap-1.5 font-semibold"
            onClick={() => router.push('/dashboard')}
          >
            <Image src={LOCAL_IMAGE.APP_LOGO} alt="Tionix_Logo" className="w-16" />
            <span>Tionix ERP</span>
            <span className="bg-muted text-muted-foreground text-xxs rounded px-1.5 py-0.5 font-medium">
              v2026.01
            </span>
          </div>
          <span className="text-border">|</span>
          <p className="text-muted-foreground text-[11px]">
            {t('licensedTo')}:{' '}
            <span className="text-foreground font-medium">FALCON MATERIAL HANDLING FZ LLC</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-accent text-foreground border-border text-xxs inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t('systemLive')}
          </span>
          {mounted && (
            <button
              onClick={handleThemeChange}
              className="border-border bg-accent hover:bg-muted flex h-6 w-6 items-center justify-center rounded-md border transition"
            >
              {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
        </div>
      </header>

      <section className="border-border bg-card flex h-11 items-center justify-between border-b px-3">
        <nav className="flex items-center gap-0.5">
          {NAV_MENUS.map((menu) => (
            <NestedDropdownMenu
              key={menu.key}
              label={t(menu.key)}
              items={menu.items}
              open={openMenu === menu.key}
              onOpenChange={(open) => setOpenMenu(open ? menu.key : null)}
              // onAction={(key) => router.push("/user-rights")}
            />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SelectDropDown
            label={t('language')}
            value={i18n.language}
            options={[
              { label: t('english'), value: 'en' },
              { label: t('arabic'), value: 'ar' },
              { label: t('hindi'), value: 'hi' },
            ]}
            onChange={(lang) => {
              i18n.changeLanguage(lang);
              localStorage.setItem('lang', lang);
            }}
            selectContentClassName="w-42"
          />
          <SelectDropDown
            label={t('format')}
            value="pdf"
            width="w-28"
            options={[
              { label: t('pdfDocument'), value: 'pdf' },
              { label: t('excelSheet'), value: 'excel' },
            ]}
            selectContentClassName="w-32"
          />
          <SelectDropDown
            label={t('financialYear')}
            value="2025/04 - 2026/03"
            width="w-34"
            options={[
              { label: '2025/04 - 2026/03', value: '2025/04 - 2026/03' },
              { label: '2024/04 - 2025/03', value: '2024/04 - 2025/03' },
            ]}
            selectContentClassName="w-42"
          />
        </div>
      </section>
    </div>
  );
}

export default Navbar;
