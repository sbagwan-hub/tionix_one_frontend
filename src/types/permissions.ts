export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface PermissionGroup {
  resource: string;
  permissions: {
    create: string;
    read: string;
    update: string;
    delete: string;
  };
}

export interface UserPermission {
  userId: string;
  permissions: string[];
  roles: string[];
}

export interface AccessControl {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}
