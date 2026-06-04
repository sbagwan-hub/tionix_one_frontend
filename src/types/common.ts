export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  phone?: string;
  isActive: boolean;
  companyId?: string;
  lastLoginAt?: string;
}

export interface Company extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  isActive: boolean;
}

export interface Operator extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  certifications?: string[];
  companyId: string;
  isActive: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: MenuItem[];
  permissions?: string[];
}
