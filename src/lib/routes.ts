export const ROUTES = {
  COMPANIES: '/masters/companies',
  DASHBOARD: '/dashboard',
  FORGOT_PASSWORD: '/auth/forgot-password',
  INVENTORY: '/inventory',
  LOGIN: '/auth/login',
  MASTERS: '/masters',
  OPERATORS: '/masters/operators',
  PROFILE: '/profile',
  PURCHASE_ORDERS: '/purchase-orders',
  REPORTS: '/reports',
  SALES_ORDERS: '/sales-orders',
  SETTINGS: '/settings',
  USERS: '/masters/users',
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
