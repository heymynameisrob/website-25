import eslintPluginAstro from "eslint-plugin-astro";
import eslintTypescript from "@typescript-eslint/eslint-plugin";
import eslintReact from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import eslintReactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": eslintTypescript,
      react: eslintReact,
      "react-hooks": eslintReactHooks,
      prettier: prettier,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "react/destructuring-assignment": "off",
      "react/require-default-props": "off",
      "react/jsx-props-no-spreading": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "prettier/prettier": "warn",
    },
  },
  ...eslintPluginAstro.configs.recommended,
];
