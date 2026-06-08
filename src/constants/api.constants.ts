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
} as const;
