export const ENV = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),

  // Application Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Tionix One',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '2026.01',

  // Authentication Configuration
  TOKEN_EXPIRY: parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRY || '3600'),
  REFRESH_TOKEN_EXPIRY: parseInt(process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY || '86400'),

  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',

  // Storage
  STORAGE_PREFIX: process.env.NEXT_PUBLIC_STORAGE_PREFIX || 'tionix_one',
} as const;

export function isDevelopment(): boolean {
  return ENV.IS_DEVELOPMENT;
}

export function isProduction(): boolean {
  return ENV.IS_PRODUCTION;
}

export function getApiUrl(): string {
  return ENV.API_URL;
}

export function getAppName(): string {
  return ENV.APP_NAME;
}

export function getAppVersion(): string {
  return ENV.APP_VERSION;
}
