import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // 1. Use ESLint recommended rules
  js.configs.recommended,
  
  // 2. Turn off rules that conflict with Prettier
  prettierConfig,

  // 3. Specify global ignore patterns (equivalent to .eslintignore)
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
  },

  // 4. Configure language options and custom rules
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off', // Enabled since Node servers use logging
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
    },
  },
];
