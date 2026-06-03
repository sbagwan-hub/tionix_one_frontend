import { MenuItem } from '@/components/shared/nested-dropdown-menu';

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
        icon: 'User',
      },
      {
        key: 'userRights',
        shortcut: '⌘ R',
        href: '/user-rights',
        icon: 'ShieldAlert',
      },
      {
        key: 'financialYearMenu',
        shortcut: '⌘ F',
        href: '/financial-year',
        icon: 'Calendar',
      },
      { separator: true },
      {
        key: 'changeServer',
        icon: 'Server',
        action: () => {
          console.log('Change server');
        },
      },
      {
        key: 'backup',
        icon: 'Database',
        action: () => {
          console.log('Backup started');
        },
      },
      { separator: true },
      {
        key: 'exit',
        shortcut: '⌥ F4',
        icon: 'LogOut',
        action: () => {
          window.close();
        },
      },
    ],
  },

  {
    key: 'master',
    items: [
      { key: 'company', href: '/company', icon: 'Building2' },
      { key: 'customer', href: '/customer', icon: 'Users' },
      { key: 'supplier', href: '/supplier', icon: 'Truck' },
      { key: 'items', href: '/items', icon: 'Package' },
    ],
  },

  {
    key: 'transaction',
    items: [
      { key: 'sales', href: '/sales', icon: 'ShoppingBag' },
      { key: 'purchase', href: '/purchase', icon: 'CreditCard' },
      { key: 'payment', href: '/payment', icon: 'CreditCard' },
      { key: 'receipt', href: '/receipt', icon: 'Receipt' },
    ],
  },

  {
    key: 'report',
    items: [
      { key: 'salesReport', href: '/reports/sales', icon: 'TrendingUp' },
      { key: 'stockReport', href: '/reports/stock', icon: 'BarChart3' },
      { key: 'profitLoss', href: '/reports/profit-loss', icon: 'PieChart' },
    ],
  },

  {
    key: 'settings',
    items: [
      { key: 'preferences', href: '/preferences', icon: 'Settings2' },
      { key: 'theme', href: '/theme', icon: 'Palette' },
    ],
  },

  {
    key: 'utilities',
    items: [
      {
        key: 'calculator',
        icon: 'Calculator',
        action: () => {
          console.log('Open calculator');
        },
      },
      {
        key: 'importExport',
        href: '/import-export',
        icon: 'FileUpDown',
      },
    ],
  },

  {
    key: 'window',
    items: [
      {
        key: 'minimize',
        icon: 'Minus',
        action: () => console.log('Minimize'),
      },
      {
        key: 'maximize',
        icon: 'Square',
        action: () => console.log('Maximize'),
      },
    ],
  },

  {
    key: 'help',
    items: [
      { key: 'documentation', href: '/documentation', icon: 'BookOpen' },
      {
        key: 'about',
        icon: 'Info',
        action: () => console.log('About app'),
      },
    ],
  },
];
