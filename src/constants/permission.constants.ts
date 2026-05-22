import { PermissionKey, PermissionRow } from '@/types/permission.types';

export const PERMISSION_COLUMNS: {
  key: PermissionKey;
  label: string;
}[] = [
  { key: 'read', label: 'Read' },
  { key: 'write', label: 'Write' },
  { key: 'update', label: 'Update' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
  { key: 'authorize', label: 'Auth' },
];

export const USERS = [
  {
    id: '1',
    name: 'Supervisor',
    roleKey: 'Admin',
  },
];

export const INITIAL_MATRIX: Record<string, PermissionRow[]> = {
  transaction: [
    {
      id: '1',
      moduleNameKey: 'Sales',
      permissions: {
        read: true,
        write: true,
        update: false,
        edit: false,
        delete: false,
        authorize: false,
      },
    },
  ],
};

export const moduleGroups = [
  {
    group: 'Administration',
    rows: [
      {
        id: 1,
        title: 'Company Profile Setup',
        add: true,
        edit: true,
        delete: false,
        view: true,
        print: false,
        export: false,
      },
      {
        id: 2,
        title: 'User Account Provisioning',
        add: true,
        edit: true,
        delete: true,
        view: true,
        print: true,
        export: true,
      },
      // 3 more rows...
    ],
  },

  {
    group: 'Utilities',
    rows: [
      {
        id: 6,
        title: 'Backup & Restore',
        add: true,
        edit: false,
        delete: false,
        view: true,
        print: false,
        export: true,
      },
      {
        id: 7,
        title: 'System Logs',
        add: false,
        edit: false,
        delete: false,
        view: true,
        print: true,
        export: true,
      },
    ],
  },
  {
    group: 'Utilities',
    rows: [
      {
        id: 6,
        title: 'Backup & Restore',
        add: true,
        edit: false,
        delete: false,
        view: true,
        print: false,
        export: true,
      },
      {
        id: 7,
        title: 'System Logs',
        add: false,
        edit: false,
        delete: false,
        view: true,
        print: true,
        export: true,
      },
    ],
  },
  {
    group: 'Utilities',
    rows: [
      {
        id: 6,
        title: 'Backup & Restore',
        add: true,
        edit: false,
        delete: false,
        view: true,
        print: false,
        export: true,
      },
      {
        id: 7,
        title: 'System Logs',
        add: false,
        edit: false,
        delete: false,
        view: true,
        print: true,
        export: true,
      },
    ],
  },
];
