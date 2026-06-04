import { useMemo } from 'react';

export interface Permission {
  resource: string;
  action: string;
}

export function usePermission(permissions: Permission[] = []) {
  const hasPermission = useMemo(() => {
    return (resource: string, action: string) => {
      return permissions.some(
        permission => permission.resource === resource && permission.action === action
      );
    };
  }, [permissions]);

  const hasAnyPermission = useMemo(() => {
    return (resource: string, actions: string[]) => {
      return actions.some(action => hasPermission(resource, action));
    };
  }, [hasPermission]);

  const hasAllPermissions = useMemo(() => {
    return (resource: string, actions: string[]) => {
      return actions.every(action => hasPermission(resource, action));
    };
  }, [hasPermission]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
