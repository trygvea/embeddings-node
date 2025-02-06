module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["dist", "generated", "grammar", "**/__tests__/**", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  },
};
