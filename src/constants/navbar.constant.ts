import { MenuItem } from '@/components/shared/nested-dropdown-menu';
import { useWindowStore } from '@/stores/window-store';

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
        href: '/administrator/users',
        icon: 'User',
      },
      {
        key: 'userRights',
        shortcut: '⌘ R',
        href: '/administrator/user-rights',
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
      { key: 'Documents', href: '/documents', icon: 'List' },
      {
        key: 'Contacts',
        icon: 'User',
        children: [
          {
            key: 'qualification',
            icon: 'GraduationCap',
            action: () => useWindowStore.getState().openWindow('contacts-qualification'),
          },
          {
            key: 'relationship',
            icon: 'Heart',
            action: () => useWindowStore.getState().openWindow('contacts-relationship'),
          },
          {
            key: 'productCategory',
            icon: 'Layers',
            action: () => useWindowStore.getState().openWindow('contacts-product-category'),
          },
          {
            key: 'department',
            icon: 'Building2',
            action: () => useWindowStore.getState().openWindow('contacts-department'),
          },
          {
            key: 'designation',
            icon: 'Briefcase',
            action: () => useWindowStore.getState().openWindow('contacts-designation'),
          },
        ],
      },
      {
        key: 'Accounts',
        icon: 'PieChart',
        children: [
          { key: 'group', href: '/masters/accounts/account-groups', icon: 'Folder' },
          { key: 'account', href: '/masters/accounts/accounts', icon: 'FileText' },
          { key: 'bankAccount', href: '/masters/accounts/bank-accounts', icon: 'Briefcase' },
          { key: 'debitCard', href: '/masters/accounts/debit-cards', icon: 'CreditCard' },
          { key: 'chequeBook', href: '/masters/accounts/cheque-books', icon: 'BookOpen' },
          {
            key: 'openingBalanceSplitUp',
            href: '/masters/accounts/opening-balance-split',
            icon: 'Scale',
          },
          { key: 'paymentPurpose', href: '/masters/accounts/payment-purposes', icon: 'Wallet' },
        ],
      },
      { key: 'HR', href: '/hr', icon: 'Users' },
      { key: 'Salary', href: '/salary', icon: 'DollarSign' },
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
