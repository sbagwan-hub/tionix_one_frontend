import { PermissionKey, PermissionRow } from '@/types/permission.types';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit3,
  FileOutput,
  HelpCircle,
  LogOut,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';

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
];

export const navigationToolbar = [
  {
    icon: ChevronsLeft,
    title: 'First',
    onClick: () => console.log('First'),
  },

  {
    icon: ChevronLeft,
    title: 'Previous',
    onClick: () => console.log('Previous'),
  },

  {
    icon: ChevronRight,
    title: 'Next',
    onClick: () => console.log('Next'),
  },

  {
    icon: ChevronsRight,
    title: 'Last',
    onClick: () => console.log('Last'),
  },
];

export const actionToolbar = [
  {
    label: 'Add New',
    icon: Plus,
    variant: 'primary',
    onClick: () => console.log('Add New'),
  },

  {
    label: 'Edit',
    icon: Edit3,
    variant: 'secondary',
    onClick: () => console.log('Edit'),
  },

  {
    label: 'Delete',
    icon: Trash2,
    variant: 'danger',
    onClick: () => console.log('Delete'),
  },

  {
    label: 'Save',
    icon: Save,
    variant: 'success',
    onClick: () => console.log('Save'),
  },

  {
    label: 'Refresh',
    icon: RefreshCw,
    variant: 'secondary',
    onClick: () => window.location.reload(),
  },
] as const;

export const utilityToolbar = [
  {
    icon: Printer,
    title: 'Print',
    onClick: () => window.print(),
  },

  {
    icon: FileOutput,
    title: 'Export',
    onClick: () => console.log('Export'),
  },

  {
    icon: HelpCircle,
    title: 'Help',
    onClick: () => alert('Help clicked'),
  },

  {
    icon: LogOut,
    title: 'Exit',
    onClick: () => console.log('Exit'),
  },
];
