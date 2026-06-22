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
import { Menu, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useFontSize } from '@/providers/font-size-provider';
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
  const { isAuthenticated, user, logout, userRights } = useAuthStore();
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();

  const isAdmin = userRights?.user?.sys_defined === true;

  const menus = React.useMemo(() => {
    if (isAdmin) {
      return NAV_MENUS;
    }
    return NAV_MENUS.filter((menu) => menu.key !== 'administrator');
  }, [isAdmin]);

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
          {menus.map((menu) => (
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

        {/* Theme Switcher or User Dropdown depending on auth status */}
        {mounted && (
          <>
            {!isAuthenticated ? (
              <div className="scale-85 opacity-90 transition-opacity hover:opacity-100">
                <ThemeSwitcher />
              </div>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="hover:bg-muted/80 text-foreground bg-muted flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none">
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-border bg-popover text-popover-foreground w-52 border p-1.5 shadow-md"
                >
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-xs leading-none font-bold">{user?.username}</p>
                    {user?.email && (
                      <p className="text-muted-foreground text-[10px] leading-none">
                        {user?.email}
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator className="bg-border/60 my-1" />
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-muted-foreground text-xs font-medium">Theme</span>
                    <ThemeSwitcher />
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-muted-foreground text-xs font-medium">Font Size</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          decreaseFontSize();
                        }}
                        className="hover:bg-accent hover:text-accent-foreground text-foreground flex h-5.5 w-5.5 cursor-pointer items-center justify-center rounded-sm border border-border bg-transparent text-[10px] font-bold transition-all focus:outline-none"
                        title="Decrease Font Size"
                      >
                        A-
                      </button>
                      <span className="text-[11px] font-bold min-w-8 text-center">{fontSize}px</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          increaseFontSize();
                        }}
                        className="hover:bg-accent hover:text-accent-foreground text-foreground flex h-5.5 w-5.5 cursor-pointer items-center justify-center rounded-sm border border-border bg-transparent text-[10px] font-bold transition-all focus:outline-none"
                        title="Increase Font Size"
                      >
                        A+
                      </button>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-border/60 my-1" />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      router.push('/auth/login');
                    }}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
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
              {menus.map((menu) => (
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
