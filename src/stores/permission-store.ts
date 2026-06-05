import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface PermissionState {
  permissions: Permission[];
  loading: boolean;
  setPermissions: (permissions: Permission[]) => void;
  setLoading: (loading: boolean) => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (resource: string, actions: string[]) => boolean;
  hasAllPermissions: (resource: string, actions: string[]) => boolean;
  clearPermissions: () => void;
}

export const usePermissionStore = create<PermissionState>()(
  persist(
    (set, get) => ({
      permissions: [],
      loading: false,

      setPermissions: (permissions) => {
        set({ permissions, loading: false });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      hasPermission: (resource, action) => {
        const { permissions } = get();
        return permissions.some(
          (permission) => permission.resource === resource && permission.action === action,
        );
      },

      hasAnyPermission: (resource, actions) => {
        const { permissions } = get();
        return actions.some((action) =>
          permissions.some(
            (permission) => permission.resource === resource && permission.action === action,
          ),
        );
      },

      hasAllPermissions: (resource, actions) => {
        const { permissions } = get();
        return actions.every((action) =>
          permissions.some(
            (permission) => permission.resource === resource && permission.action === action,
          ),
        );
      },

      clearPermissions: () => {
        set({ permissions: [], loading: false });
      },
    }),
    {
      name: 'permission-storage',
      partialize: (state) => ({
        permissions: state.permissions,
      }),
    },
  ),
);
