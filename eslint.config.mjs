import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';

const prettierConfigs = Array.isArray(prettierConfig) ? prettierConfig : [prettierConfig];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...prettierConfigs,
  // Override default ignores of eslint-config-next.
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
