import { PERMISSIONS } from './constants';

export interface Permission {
  resource: string;
  action: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.COMPANY_READ,
    PERMISSIONS.COMPANY_UPDATE,
    PERMISSIONS.OPERATOR_CREATE,
    PERMISSIONS.OPERATOR_READ,
    PERMISSIONS.OPERATOR_UPDATE,
    PERMISSIONS.OPERATOR_DELETE,
    PERMISSIONS.SYSTEM_REPORTS,
  ],
  operator: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.COMPANY_READ,
    PERMISSIONS.OPERATOR_READ,
    PERMISSIONS.SYSTEM_REPORTS,
  ],
  viewer: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.COMPANY_READ,
    PERMISSIONS.OPERATOR_READ,
    PERMISSIONS.SYSTEM_REPORTS,
  ],
};

export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
}

export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
}

export function getPermissionDescription(permission: string): string {
  const descriptions: Record<string, string> = {
    [PERMISSIONS.USER_CREATE]: 'Create new users',
    [PERMISSIONS.USER_READ]: 'View users',
    [PERMISSIONS.USER_UPDATE]: 'Update user information',
    [PERMISSIONS.USER_DELETE]: 'Delete users',
    [PERMISSIONS.COMPANY_CREATE]: 'Create new companies',
    [PERMISSIONS.COMPANY_READ]: 'View companies',
    [PERMISSIONS.COMPANY_UPDATE]: 'Update company information',
    [PERMISSIONS.COMPANY_DELETE]: 'Delete companies',
    [PERMISSIONS.OPERATOR_CREATE]: 'Create new operators',
    [PERMISSIONS.OPERATOR_READ]: 'View operators',
    [PERMISSIONS.OPERATOR_UPDATE]: 'Update operator information',
    [PERMISSIONS.OPERATOR_DELETE]: 'Delete operators',
    [PERMISSIONS.SYSTEM_SETTINGS]: 'Access system settings',
    [PERMISSIONS.SYSTEM_REPORTS]: 'View system reports',
  };
  
  return descriptions[permission] || permission;
}
