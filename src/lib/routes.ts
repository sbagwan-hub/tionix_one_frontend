export const ROUTES = {
  // Auth routes
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',

  // Dashboard routes
  DASHBOARD: '/dashboard',

  // Masters routes
  MASTERS: '/masters',
  USERS: '/masters/users',
  COMPANIES: '/masters/companies',
  OPERATORS: '/masters/operators',

  // Operations routes
  SALES_ORDERS: '/sales-orders',
  PURCHASE_ORDERS: '/purchase-orders',
  INVENTORY: '/inventory',

  // Reports routes
  REPORTS: '/reports',

  // Settings routes
  SETTINGS: '/settings',

  // Profile routes
  PROFILE: '/profile',
} as const;

export const ROUTE_GROUPS = {
  AUTH: [ROUTES.LOGIN, ROUTES.FORGOT_PASSWORD],
  DASHBOARD: [ROUTES.DASHBOARD],
  MASTERS: [ROUTES.MASTERS, ROUTES.USERS, ROUTES.COMPANIES, ROUTES.OPERATORS],
  OPERATIONS: [ROUTES.SALES_ORDERS, ROUTES.PURCHASE_ORDERS, ROUTES.INVENTORY],
  REPORTS: [ROUTES.REPORTS],
  SETTINGS: [ROUTES.SETTINGS, ROUTES.PROFILE],
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.FORGOT_PASSWORD] as const;

export const PROTECTED_ROUTES = Object.values(ROUTES).filter(
  (route): route is Exclude<typeof route, (typeof PUBLIC_ROUTES)[number]> =>
    !PUBLIC_ROUTES.includes(route as (typeof PUBLIC_ROUTES)[number]),
);
