interface MenuItem {
  key?: string;
  shortcut?: string;
  separator?: boolean;
}

interface NavMenu {
  key: string;
  items: MenuItem[];
}

export const NAV_MENUS: NavMenu[] = [
  {
    key: 'administrator',
    items: [
      { key: 'users' },
      { key: 'userRights', shortcut: '⌘ R' },
      { key: 'financialYearMenu', shortcut: '⌘ F' },
      { separator: true },
      { key: 'changeServer' },
      { key: 'backup' },
      { separator: true },
      { key: 'exit', shortcut: '⌥ F4' },
    ],
  },

  {
    key: 'master',
    items: [{ key: 'company' }, { key: 'customer' }, { key: 'supplier' }, { key: 'items' }],
  },

  {
    key: 'transaction',
    items: [{ key: 'sales' }, { key: 'purchase' }, { key: 'payment' }, { key: 'receipt' }],
  },

  {
    key: 'report',
    items: [{ key: 'salesReport' }, { key: 'stockReport' }, { key: 'profitLoss' }],
  },

  {
    key: 'settings',
    items: [{ key: 'preferences' }, { key: 'theme' }],
  },

  {
    key: 'utilities',
    items: [{ key: 'calculator' }, { key: 'importExport' }],
  },

  {
    key: 'window',
    items: [{ key: 'minimize' }, { key: 'maximize' }],
  },

  {
    key: 'help',
    items: [{ key: 'documentation' }, { key: 'about' }],
  },
];
