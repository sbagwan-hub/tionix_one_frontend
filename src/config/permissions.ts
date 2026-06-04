import { ROLE_PERMISSIONS } from '@/lib/permissions';

export const PERMISSION_CONFIG = {
  // Define resource-action mappings
  resources: {
    user: ['create', 'read', 'update', 'delete'],
    company: ['create', 'read', 'update', 'delete'],
    operator: ['create', 'read', 'update', 'delete'],
    system: ['settings', 'reports'],
  },
  
  // Define role-based permissions
  roles: ROLE_PERMISSIONS,
  
  // Define permission hierarchy
  hierarchy: {
    admin: ['manager', 'operator', 'viewer'],
    manager: ['operator', 'viewer'],
    operator: ['viewer'],
    viewer: [],
  },
} as const;

export function getPermissionsForRole(role: string): string[] {
  return PERMISSION_CONFIG.roles[role] || [];
}

export function canRoleAccessResource(role: string, resource: string, action: string): boolean {
  const permissions = getPermissionsForRole(role);
  const requiredPermission = `${resource}:${action}`;
  return permissions.includes(requiredPermission);
}

export function getHigherRoles(role: string): string[] {
  return [...(PERMISSION_CONFIG.hierarchy[role as keyof typeof PERMISSION_CONFIG.hierarchy] || [])];
}

export function isRoleHigherOrEqual(currentRole: string, targetRole: string): boolean {
  if (currentRole === targetRole) return true;
  return getHigherRoles(targetRole).includes(currentRole);
}
