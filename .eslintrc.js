module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  extends: [
    'plugin:prettier/recommended',
    'alloy',
    'alloy/react',
    'alloy/typescript',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  env: {
    // Your environments (which contains several predefined global variables)
    //
    // browser: true,
  },
  globals: {
    // Your global variables (setting to false means it's not allowed to be reassigned)
    //
    // __DEV__: 'readonly',
  },
  rules: {
    // Customize your rules
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "warn",
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
