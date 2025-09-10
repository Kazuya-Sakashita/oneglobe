// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginA11y from "eslint-plugin-jsx-a11y";
import pluginImport from "eslint-plugin-import";
import pluginUnused from "eslint-plugin-unused-imports";
import pluginTailwind from "eslint-plugin-tailwindcss";
import prettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Next.js 推奨セット（compat で旧形式を取り込む）
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 基本の推奨セット
  js.configs.recommended,
  ...tseslint.configs.recommended, // TypeScript 推奨
  pluginReact.configs.recommended, // React 推奨
  pluginA11y.configs.recommended, // a11y 推奨
  pluginImport.configs.recommended, // import 系
  pluginTailwind.configs.recommended, // Tailwind（v4 は @beta を想定）
  // 開発時のHMR安全性（Next.js 15 で推奨）
  pluginReactRefresh.configs.recommended,
  // Prettier で競合無効化
  prettier,

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
      "jsx-a11y": pluginA11y,
      import: pluginImport,
      "unused-imports": pluginUnused,
      tailwindcss: pluginTailwind,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      /** TypeScript **/
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      /** import 順序 **/
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "type",
          ],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "next/**", group: "external", position: "before" },
            { pattern: "@/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      /** Tailwind **/
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",

      /** 未使用 import の削除 **/
      "unused-imports/no-unused-imports": "error",

      /** React Hooks ルール（必須） **/
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /** react-refresh（開発時の誤用防止） **/
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // Server Actions 用チェック（任意）
  {
    files: ["src/app/**/_server/**/*.{ts,tsx}", "src/app/**/route.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ExportNamedDeclaration:not(:has(FunctionDeclaration[async=true])):has(Literal[value='use server'])",
          message:
            "Next15のServer Actionsでは 'use server' ファイルは async 関数の named export のみ許可されます。",
        },
      ],
    },
  },
];
