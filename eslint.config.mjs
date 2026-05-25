import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const prettierConfigs = Array.isArray(prettierConfig)
  ? prettierConfig
  : [prettierConfig];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...prettierConfigs,

  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "warn",

      // Allow `any`
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;