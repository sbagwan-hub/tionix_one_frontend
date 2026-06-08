export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    GET: '/users/:id',
  },
  COMPANIES: {
    LIST: '/companies',
    CREATE: '/companies',
    UPDATE: '/companies/:id',
    DELETE: '/companies/:id',
    GET: '/companies/:id',
  },
  OPERATORS: {
    LIST: '/operators',
    CREATE: '/operators',
    UPDATE: '/operators/:id',
    DELETE: '/operators/:id',
    GET: '/operators/:id',
  },
} as const;

export const APP_CONFIG = {
  NAME: 'Tionix One',
  VERSION: '2026.01',
  DESCRIPTION: 'Enterprise Operations Management System',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
} as const;

export const PERMISSIONS = {
  COMPANY_CREATE: 'company:create',
  COMPANY_DELETE: 'company:delete',
  COMPANY_READ: 'company:read',
  COMPANY_UPDATE: 'company:update',

  OPERATOR_CREATE: 'operator:create',
  OPERATOR_DELETE: 'operator:delete',
  OPERATOR_READ: 'operator:read',
  OPERATOR_UPDATE: 'operator:update',

  SYSTEM_REPORTS: 'system:reports',
  SYSTEM_SETTINGS: 'system:settings',

  USER_CREATE: 'user:create',
  USER_DELETE: 'user:delete',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
} as const;

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^[+]?[\d\s\-\(\)]+$/,
  USERNAME_MIN_LENGTH: 3,
} as const;
