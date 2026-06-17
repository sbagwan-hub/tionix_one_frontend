import { MenuItem } from '@/types/common';
import {
  BarChart3,
  Users,
  Building2,
  UserCheck,
  ShoppingCart,
  Package,
  FileText,
  Settings,
} from 'lucide-react';

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    id: 'masters',
    label: 'Masters',
    href: '/masters',
    icon: Users,
    children: [
      {
        id: 'users',
        label: 'Users',
        href: '/masters/users',
        permissions: ['user:read'],
      },
      {
        id: 'employees',
        label: 'Employees',
        href: '/masters/employees',
        permissions: ['employee:read'],
      },
      {
        id: 'companies',
        label: 'Companies',
        href: '/masters/companies',
        permissions: ['company:read'],
      },
      {
        id: 'operators',
        label: 'Operators',
        href: '/masters/operators',
        permissions: ['operator:read'],
      },
    ],
  },
  {
    id: 'sales-orders',
    label: 'Sales Orders',
    href: '/sales-orders',
    icon: ShoppingCart,
    permissions: ['sales_order:read'],
  },
  {
    id: 'purchase-orders',
    label: 'Purchase Orders',
    href: '/purchase-orders',
    icon: Package,
    permissions: ['purchase_order:read'],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    href: '/inventory',
    icon: Package,
    permissions: ['inventory:read'],
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: FileText,
    permissions: ['system:reports'],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    permissions: ['system:settings'],
  },
];

export function getMenuItemsByPermissions(userPermissions: string[]): MenuItem[] {
  return menuItems.filter((item) => {
    if (!item.permissions) return true;
    return item.permissions.some((permission) => userPermissions.includes(permission));
  });
}

export function hasMenuAccess(menuItem: MenuItem, userPermissions: string[]): boolean {
  if (!menuItem.permissions) return true;
  return menuItem.permissions.some((permission) => userPermissions.includes(permission));
}
