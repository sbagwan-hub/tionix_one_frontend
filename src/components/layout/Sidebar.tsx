'use client';

import * as React from 'react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { useWindowStore } from '@/stores/window-store';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Calendar,
  FileText,
  ChevronDown,
  ChevronRight,
  Menu,
  Building,
  Building2,
  Folder,
  CreditCard,
  BookOpen,
  Scale,
  Wallet,
  Clock,
  Percent,
  ShoppingBag,
  Receipt,
  Palette,
  Calculator,
  FileUpIcon,
  LogOut,
  Settings2,
  Users2,
  GraduationCap,
  UserCheck,
  HelpCircle,
  Briefcase,
  Layers,
  MapPin,
  Map,
  Locate,
  Home,
  Settings,
  Heart,
  Coins,
} from 'lucide-react';

interface SidebarItem {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  action?: () => void;
  children?: {
    key: string;
    label: string;
    icon?: React.ComponentType<any>;
    href?: string;
    action?: () => void;
  }[];
}

interface SidebarCategory {
  title: string;
  items: SidebarItem[];
}

export function Sidebar() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { userRights, logout } = useAuthStore();
  const windowStore = useWindowStore();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    dashboard: true,
    contacts: false,
    accounts: false,
    salary: false,
  });

  const toggleSubmenu = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isAdmin = userRights?.user?.sys_defined === true;

  const categories: SidebarCategory[] = [
    {
      title: 'Main',
      items: [
        {
          key: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          children: [
            { key: 'admin-dash', label: 'Admin Dashboard', href: '/dashboard' },
            { key: 'teacher-dash', label: 'Teacher Dashboard', href: '/dashboard' },
            { key: 'student-dash', label: 'Student Dashboard', href: '/dashboard' },
            { key: 'parent-dash', label: 'Parent Dashboard', href: '/dashboard' },
          ],
        },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: 'Administrator',
            items: [
              { key: 'users', label: 'Users', icon: Users, href: '/administrator/users' },
              {
                key: 'userRights',
                label: 'Roles & Permissions',
                icon: ShieldCheck,
                href: '/administrator/user-rights',
              },
              {
                key: 'financialYearMenu',
                label: 'Financial Year',
                icon: Calendar,
                href: '/financial-year',
              },
            ],
          },
        ]
      : []),
    {
      title: 'Master Files',
      items: [
        { key: 'documents', label: 'Documents', icon: FileText, href: '/documents' },
        {
          key: 'contacts',
          label: 'Contacts',
          icon: Users2,
          children: [
            {
              key: 'individual',
              label: 'Individual Contacts',
              icon: UserCheck,
              href: '/masters/contacts/individual',
            },
            {
              key: 'organisation',
              label: 'Organisation Contacts',
              icon: Building2,
              href: '/masters/contacts/organisation',
            },
            {
              key: 'titles',
              label: 'Titles',
              icon: Users,
              action: () => windowStore.openWindow('contacts-title'),
            },
            {
              key: 'qualification',
              label: 'Qualifications',
              icon: GraduationCap,
              action: () => windowStore.openWindow('contacts-qualification'),
            },
            {
              key: 'relationship',
              label: 'Relationships',
              icon: Heart,
              action: () => windowStore.openWindow('contacts-relationship'),
            },
            {
              key: 'productCategory',
              label: 'Product Categories',
              icon: Layers,
              action: () => windowStore.openWindow('contacts-product-category'),
            },
            {
              key: 'department',
              label: 'Departments',
              icon: Building2,
              action: () => windowStore.openWindow('contacts-department'),
            },
            {
              key: 'designation',
              label: 'Designations',
              icon: Briefcase,
              action: () => windowStore.openWindow('contacts-designation'),
            },
            {
              key: 'city',
              label: 'Cities',
              icon: MapPin,
              action: () => windowStore.openWindow('contacts-city'),
            },
            {
              key: 'state',
              label: 'States',
              icon: Map,
              action: () => windowStore.openWindow('contacts-state'),
            },
            {
              key: 'region',
              label: 'Regions',
              icon: Locate,
              action: () => windowStore.openWindow('contacts-region'),
            },
            {
              key: 'address',
              label: 'Addresses',
              icon: Home,
              action: () => windowStore.openWindow('contacts-address'),
            },
            {
              key: 'modeOfContact',
              label: 'Modes of Contact',
              icon: Settings,
              action: () => windowStore.openWindow('contacts-mode-of-contact'),
            },
          ],
        },
        {
          key: 'accounts',
          label: 'Accounts',
          icon: Folder,
          children: [
            {
              key: 'group',
              label: 'Account Groups',
              icon: Folder,
              href: '/masters/accounts/account-groups',
            },
            {
              key: 'account',
              label: 'Accounts',
              icon: FileText,
              href: '/masters/accounts/accounts',
            },
            {
              key: 'bankAccount',
              label: 'Bank Accounts',
              icon: Briefcase,
              href: '/masters/accounts/bank-accounts',
            },
            {
              key: 'asset',
              label: 'Assets',
              icon: Briefcase,
              href: '/masters/accounts/assets',
            },
            {
              key: 'oldAsset',
              label: 'Old Assets',
              icon: Briefcase,
              href: '/masters/accounts/old-assets',
            },
            {
              key: 'debitCard',
              label: 'Debit Cards',
              icon: CreditCard,
              action: () => windowStore.openWindow('accounts-debit-card'),
            },
            {
              key: 'chequeBook',
              label: 'Cheque Books',
              icon: BookOpen,
              action: () => windowStore.openWindow('accounts-cheque-book'),
            },
            {
              key: 'openingBalanceSplitUp',
              label: 'Opening Bal Split',
              icon: Scale,
              href: '/masters/accounts/opening-balance-split',
            },
            {
              key: 'paymentPurpose',
              label: 'Payment Purposes',
              icon: Wallet,
              href: '/masters/accounts/payment-purposes',
            },
          ],
        },
        { key: 'employee', label: 'Employees', icon: Users, href: '/masters/employees' },
        {
          key: 'salary',
          label: 'Salary Settings',
          icon: Coins,
          children: [
            {
              key: 'Skintones',
              label: 'Skintones',
              icon: Users,
              action: () => windowStore.openWindow('salary-skintone'),
            },
            {
              key: 'Castes/Sub-Castes',
              label: 'Castes/Sub-Castes',
              icon: Users,
              action: () => windowStore.openWindow('salary-caste'),
            },
            {
              key: 'Religions',
              label: 'Religions',
              icon: Heart,
              action: () => windowStore.openWindow('salary-religion'),
            },
            {
              key: 'Schedule Types',
              label: 'Schedule Types',
              icon: Calendar,
              action: () => windowStore.openWindow('salary-schedule-type'),
            },
            {
              key: 'Nature Of Work',
              label: 'Nature of Work',
              icon: FileText,
              action: () => windowStore.openWindow('salary-nature-of-work'),
            },
            {
              key: 'Income Tax Sections',
              label: 'Income Tax Sections',
              icon: Percent,
              action: () => windowStore.openWindow('salary-sal-it-section'),
            },
            {
              key: 'Shift Timings',
              label: 'Shift Timings',
              icon: Clock,
              action: () => windowStore.openWindow('salary-shift-timing'),
            },
            {
              key: 'Work Timings',
              label: 'Work Timings',
              icon: Clock,
              href: '/masters/salary/work-timing',
            },
          ],
        },
      ],
    },
    {
      title: 'Transactions',
      items: [
        { key: 'sales', label: 'Sales', icon: ShoppingBag, href: '/sales' },
        { key: 'purchase', label: 'Purchase', icon: CreditCard, href: '/purchase' },
        { key: 'payment', label: 'Payment', icon: CreditCard, href: '/payment' },
        { key: 'receipt', label: 'Receipt', icon: Receipt, href: '/receipt' },
      ],
    },
    {
      title: 'Settings & Utilities',
      items: [
        { key: 'preferences', label: 'Preferences', icon: Settings2, href: '/preferences' },
        { key: 'theme', label: 'Theme', icon: Palette, href: '/theme' },
        {
          key: 'calculator',
          label: 'Calculator',
          icon: Calculator,
          action: () => console.log('Open calculator'),
        },
        { key: 'importExport', label: 'Import / Export', icon: FileUpIcon, href: '/import-export' },
      ],
    },
  ];

  const handleItemClick = (item: SidebarItem) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href;
  };

  return (
    <div
      className={`bg-card text-card-foreground flex h-full flex-col overflow-hidden border-r transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-64' : 'w-[72px]'
      }`}
    >
      {/* Header Logo section */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Stylized blue book logo */}
          <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-300/40">
            <GraduationCap className="h-5 w-5" />
          </div>
          {sidebarOpen && (
            <span className="bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-base font-extrabold tracking-tight text-transparent dark:from-slate-100 dark:to-slate-300">
              PreSkool
            </span>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hover:bg-muted text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus:outline-none"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Organization Dropdown */}
      <div className="bg-muted/10 shrink-0 border-b p-3.5">
        {sidebarOpen ? (
          <div className="bg-card hover:bg-muted/30 flex cursor-pointer items-center justify-between rounded-xl border p-2 shadow-sm transition-colors">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Building className="h-4 w-4" />
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="text-xxs text-muted-foreground/80 leading-none font-bold tracking-wide uppercase">
                  School
                </span>
                <span className="text-foreground mt-0.5 truncate text-xs font-bold">
                  Global International
                </span>
              </div>
            </div>
            <ChevronDown className="text-muted-foreground/70 h-3.5 w-3.5 shrink-0" />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="group bg-card hover:bg-muted/30 relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border shadow-sm transition-colors">
              <Building className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
              {/* Collapsed Tooltip */}
              <div className="text-xxs pointer-events-none invisible absolute left-14 z-50 rounded bg-slate-900 px-2 py-1 font-bold whitespace-nowrap text-white opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
                Global International
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Body */}
      <div className="flex-1 scrollbar-thin space-y-4 overflow-x-hidden overflow-y-auto p-2">
        {categories.map((cat) => (
          <div key={cat.title} className="space-y-1">
            {sidebarOpen && (
              <div className="text-muted-foreground/50 text-xxs px-3.5 py-1.5 font-bold tracking-wider uppercase">
                {cat.title}
              </div>
            )}

            <div className="space-y-0.5">
              {cat.items.map((item) => {
                const isSubmenu = !!item.children;
                const isExpanded = expandedMenus[item.key];
                const itemActive =
                  isActive(item.href) ||
                  (isSubmenu && item.children?.some((c) => isActive(c.href)));
                const Icon = item.icon;

                return (
                  <div key={item.key} className="space-y-0.5">
                    {/* Main Row */}
                    <div className="group relative">
                      <button
                        onClick={(e) => {
                          if (isSubmenu) {
                            toggleSubmenu(item.key, e);
                          } else {
                            handleItemClick(item);
                          }
                        }}
                        className={`flex w-full items-center rounded-xl p-2.5 text-xs font-semibold transition-all focus:outline-none ${
                          itemActive
                            ? 'bg-blue-50/80 font-bold text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Icon
                            className={`h-4.5 w-4.5 shrink-0 ${itemActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground/80'}`}
                          />
                          {sidebarOpen && <span className="truncate">{item.label}</span>}
                        </div>
                        {sidebarOpen &&
                          isSubmenu &&
                          (isExpanded ? (
                            <ChevronDown className="text-muted-foreground/75 ml-1 h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <ChevronRight className="text-muted-foreground/75 ml-1 h-3.5 w-3.5 shrink-0" />
                          ))}
                      </button>

                      {/* Tooltip for mini mode */}
                      {!sidebarOpen && (
                        <div className="text-xxs pointer-events-none invisible absolute top-1/2 left-14 z-50 -translate-y-1/2 rounded bg-slate-900 px-2 py-1 font-bold whitespace-nowrap text-white opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
                          {item.label}
                        </div>
                      )}
                    </div>

                    {/* Submenu Children */}
                    {sidebarOpen && isSubmenu && isExpanded && (
                      <div className="border-muted/50 mt-0.5 ml-4.5 space-y-0.5 border-l pl-6.5">
                        {item.children?.map((sub) => {
                          const subActive = isActive(sub.href);
                          return (
                            <button
                              key={sub.key}
                              onClick={() => handleItemClick(sub as any)}
                              className={`text-xxs flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-medium transition-colors focus:outline-none ${
                                subActive
                                  ? 'bg-blue-50/40 font-bold text-blue-600 dark:bg-blue-950/10 dark:text-blue-400'
                                  : 'text-muted-foreground/90 hover:text-foreground hover:bg-muted/30'
                              }`}
                            >
                              <div
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${subActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-muted-foreground/40'}`}
                              />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
