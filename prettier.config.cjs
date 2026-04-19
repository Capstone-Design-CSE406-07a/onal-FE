// prettier.config.js
module.exports = {
  endOfLine: "lf",
  semi: true,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  singleQuote: false,
  printWidth: 100,
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/env(.*)$",
    "^@/types/(.*)$",
    "^@/hooks/(.*)$",
    "^@/entities/(.*)$",
    "^@/features/(.*)$",
    "^@/shared/ui/(.*)$",
    "^@/shared/(.*)$",
    "^@/styles/(.*)$",
    "^@/pages/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: [
    "prettier-plugin-tailwindcss",
    "prettier-plugin-organize-imports",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  overrides: [
    {
      files: "*.mdx",
      options: {
        insertFinalNewline: false,
      },
    },
  ],
};
