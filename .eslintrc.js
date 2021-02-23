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
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // Your global variables (setting to false means it's not allowed to be reassigned)
    //
    __CLIENT__: 'readonly',
    __DEV__: 'readonly',
  },
  rules: {
    // Customize your rules
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/no-empty-function":'off',
    "max-nested-callbacks": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-var-requires": "off",
    
    "complexity": ["error", { "max": 50 }],
    "max-params":["warn", { "max": 5 }],

    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
    "react/no-unescaped-entities": "warn",
    "@typescript-eslint/consistent-type-assertions": "warn",

    "no-param-reassign": "warn",
    
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
