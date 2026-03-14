import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Global Ignores (Folders we never want to look at)
  { ignores: ['dist/', 'node_modules/', 'coverage/'] },

  // 2. Base Rules for ALL files (Basic syntax checking without TypeScript compiler)
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Strict Type-Aware Rules (Strictly isolated to your production code)
  {
    files: ['src/**/*.ts'],
    ignores: ['**/*.test.ts', '**/*.spec.ts'], // Do not type-check test files even if they are in src/
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Zero tolerance for "any" types. AI loves 'any', we hate it.
      '@typescript-eslint/no-explicit-any': 'error',

      // Force explicit return types. You must know what your function outputs.
      '@typescript-eslint/explicit-function-return-type': 'error',

      // Prevent floating promises. AI often forgets to `await` async functions.
      '@typescript-eslint/no-floating-promises': 'error',

      // Prevent unused variables, but allow unused args starting with underscore
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Require handling of promises properly
      '@typescript-eslint/await-thenable': 'error',

      // Prevent using non-boolean types in if() statements (e.g., if (string))
      '@typescript-eslint/strict-boolean-expressions': 'warn',
    },
  }
);