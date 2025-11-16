import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  {
    files: ['scripts/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['components/ui/chart.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['components/ai-elements/shimmer.tsx', 'components/ui/sidebar.tsx'],
    rules: {
      'react-hooks/static-components': 'off',
      'react-hooks/purity': 'off',
    },
  },
  {
    files: ['components/workflow-builder/top-navigation.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['components/workflow-builder/**/*.tsx', 'components/ui/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: [
      'components/ai-elements/prompt-input.tsx',
      'components/ai-elements/reasoning.tsx',
      'components/workflow-builder/edge-node-dropdown.tsx',
    ],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: [
      'components/kokonutui/toolbar.tsx',
      'components/workflow-builder/import-dialog.tsx',
      'components/workflow-builder/properties-panel.tsx',
      'lib/workflow/schema/validator.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['components/ai-elements/queue.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['components/workflow-builder/executor-editors/request-info-executor-editor.tsx'],
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    files: [
      'lib/workflow/__tests__/**/*.ts',
      'lib/workflow/export/__tests__/**/*.ts',
      'components/workflow-builder/__tests__/**/*.tsx',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    files: [
      'app/page.tsx',
      'components/ai-elements/**/*.tsx',
      'components/workflow-builder/**/*.tsx',
      'components/kokonutui/**/*.tsx',
      'components/ui/**/*.tsx',
      'lib/workflow/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['components/ai-elements/edge.tsx'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    files: ['components/ai-elements/prompt-input.tsx', 'components/ai-elements/image.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['components/ai-elements/inline-citation.tsx'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['components/ai-elements/branch.tsx', 'components/ai-elements/prompt-input.tsx'],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    files: ['components/ui/use-toast.ts', 'hooks/use-toast.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['hooks/use-trackpad-navigation.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@next/next/no-img-element': 'off',
      'jsx-a11y/alt-text': 'off',
    },
  },
  {
    files: ['prettier.config.js'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
]);

export default eslintConfig;
