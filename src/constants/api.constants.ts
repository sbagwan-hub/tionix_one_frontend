export const APP_CONFIG = {
  NAME: 'Tionix One',
  VERSION: '2026.01',
  DESCRIPTION: 'Enterprise Operations Management System',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
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
} as const;

export const PERMISSIONS = {
  COMPANY_CREATE: 'COMPANY_CREATE',
  COMPANY_DELETE: 'COMPANY_DELETE',
  COMPANY_READ: 'COMPANY_READ',
  COMPANY_UPDATE: 'COMPANY_UPDATE',
  OPERATOR_CREATE: 'OPERATOR_CREATE',
  OPERATOR_DELETE: 'OPERATOR_DELETE',
  OPERATOR_READ: 'OPERATOR_READ',
  OPERATOR_UPDATE: 'OPERATOR_UPDATE',
  SYSTEM_SETTINGS: 'SYSTEM_SETTINGS',
  SYSTEM_REPORTS: 'SYSTEM_REPORTS',
  USER_CREATE: 'USER_CREATE',
  USER_DELETE: 'USER_DELETE',
  USER_READ: 'USER_READ',
  USER_UPDATE: 'USER_UPDATE',
} as const;
