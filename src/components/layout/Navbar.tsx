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
import { NavbarMenu, RenderMenuItems } from '../shared/nested-dropdown-menu';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

function Navbar() {
  const { t, i18n } = useTranslation();
  const mounted = useMounted();
  const router = useRouter();

  return (
    <div className="border-border bg-background flex h-12 w-full items-center justify-between border-b px-3.5 select-none">
      {/* Left section: Logo + Desktop Menu */}
      <div className="flex min-w-0 items-center gap-0">
        <div
          className="group flex shrink-0 cursor-pointer items-center gap-0"
          onClick={() => router.push('/dashboard')}
        >
          <Image
            src={LOCAL_IMAGE.APP_LOGO_TRANSPARENT}
            alt="Tionix_Logo"
            className="h-auto w-18 object-contain"
          />
        </div>

        <span className="bg-border/60 hidden h-4 w-px shrink-0 lg:block" />

        {/* Navigation Menus (Desktop only) */}
        <nav className="hidden min-w-0 items-center gap-0.5 lg:flex">
          {NAV_MENUS.map((menu) => (
            <NavbarMenu key={menu.key} label={t(menu.key)} items={menu.items} />
          ))}
        </nav>
      </div>

      {/* Right section: Dropdowns + Utilities */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Dropdowns (Desktop only) */}
        <div className="hidden items-center gap-2 md:flex">
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

        {/* Theme Switcher */}
        {mounted && (
          <div className="scale-85 opacity-90 transition-opacity hover:opacity-100">
            <ThemeSwitcher />
          </div>
        )}

        {/* Mobile Hamburger Menu (Mobile/Tablet only) */}
        <div className="lg:hidden">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="text-foreground/75 hover:text-foreground hover:bg-muted/80 shrink-0 cursor-pointer rounded-md p-1.5 transition-colors">
                <Menu className="h-4.5 w-4.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-border/80 bg-popover text-popover-foreground w-52 border p-1 shadow-md"
            >
              {NAV_MENUS.map((menu) => (
                <DropdownMenuSub key={menu.key}>
                  <DropdownMenuSubTrigger className="hover:bg-muted cursor-pointer px-2.5 py-1.5 text-xs font-semibold">
                    {t(menu.key)}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="border-border/80 bg-popover text-popover-foreground w-48 border p-1 shadow-md">
                      <RenderMenuItems items={menu.items} />
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ))}

              <DropdownMenuSeparator className="bg-border/65 my-1" />

              {/* Mobile Lang Option */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-muted cursor-pointer px-2.5 py-1.5 text-xs font-semibold">
                  {t('language')}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="border-border/80 bg-popover text-popover-foreground w-40 border p-1 shadow-md">
                    <DropdownMenuItem
                      onClick={() => {
                        i18n.changeLanguage('en');
                        localStorage.setItem('lang', 'en');
                      }}
                      className="cursor-pointer px-2.5 py-1.5 text-xs"
                    >
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        i18n.changeLanguage('ar');
                        localStorage.setItem('lang', 'ar');
                      }}
                      className="cursor-pointer px-2.5 py-1.5 text-xs"
                    >
                      العربية
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        i18n.changeLanguage('hi');
                        localStorage.setItem('lang', 'hi');
                      }}
                      className="cursor-pointer px-2.5 py-1.5 text-xs"
                    >
                      हिन्दी
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
