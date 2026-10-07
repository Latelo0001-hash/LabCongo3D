import js from "@eslint/js";
import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";
export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        matchMedia: "readonly",
        fetch: "readonly",
        RequestInit: "readonly",
        HTMLDivElement: "readonly",
        HTMLDialogElement: "readonly",
      },
    },
    plugins: { "react-hooks": hooks, "react-refresh": refresh },
    rules: {
      ...hooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { Buffer: "readonly" } },
  },
  {
    files: ["src/app/routes.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
);
