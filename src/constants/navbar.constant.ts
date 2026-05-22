import { MenuItem } from "@/components/shared/nested-dropdown-menu";

interface NavMenu {
  key: string;
  items: MenuItem[];
}

export const NAV_MENUS: NavMenu[] = [
  {
    key: 'administrator',
    items: [
      {
        key: 'users',
        href: '/users',
      },

      {
        key: 'userRights',
        shortcut: '⌘ R',
        href: '/user-rights',
      },

      {
        key: 'financialYearMenu',
        shortcut: '⌘ F',
        href: '/financial-year',
      },

      { separator: true },

      {
        key: 'changeServer',
        action: () => {
          console.log('Change server');
        },
      },

      {
        key: 'backup',
        action: () => {
          console.log('Backup started');
        },
      },

      { separator: true },

      {
        key: 'exit',
        shortcut: '⌥ F4',
        action: () => {
          window.close();
        },
      },
    ],
  },

  {
    key: 'master',
    items: [
      { key: 'company', href: '/company' },
      { key: 'customer', href: '/customer' },
      { key: 'supplier', href: '/supplier' },
      { key: 'items', href: '/items' },
    ],
  },

  {
    key: 'transaction',
    items: [
      { key: 'sales', href: '/sales' },
      { key: 'purchase', href: '/purchase' },
      { key: 'payment', href: '/payment' },
      { key: 'receipt', href: '/receipt' },
    ],
  },

  {
    key: 'report',
    items: [
      { key: 'salesReport', href: '/reports/sales' },
      { key: 'stockReport', href: '/reports/stock' },
      { key: 'profitLoss', href: '/reports/profit-loss' },
    ],
  },

  {
    key: 'settings',
    items: [
      { key: 'preferences', href: '/preferences' },
      { key: 'theme', href: '/theme' },
    ],
  },

  {
    key: 'utilities',
    items: [
      {
        key: 'calculator',
        action: () => {
          console.log('Open calculator');
        },
      },

      {
        key: 'importExport',
        href: '/import-export',
      },
    ],
  },

  {
    key: 'window',
    items: [
      {
        key: 'minimize',
        action: () => console.log('Minimize'),
      },

      {
        key: 'maximize',
        action: () => console.log('Maximize'),
      },
    ],
  },

  {
    key: 'help',
    items: [
      { key: 'documentation', href: '/documentation' },

      {
        key: 'about',
        action: () => console.log('About app'),
      },
    ],
  },
];