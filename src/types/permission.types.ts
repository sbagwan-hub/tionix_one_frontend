export type PermissionKey = 'read' | 'write' | 'update' | 'delete' | 'edit' | 'authorize';

export interface PermissionRow {
  id: string;
  moduleNameKey: string;
  permissions: Record<PermissionKey, boolean>;
}

export interface User {
  id: string;
  name: string;
  roleKey: string;
}
