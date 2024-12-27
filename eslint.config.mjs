import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import importHelpers from 'eslint-plugin-import-helpers';

import pluginJs from '@eslint/js';

export default [
    { ignores: ['**/dist/*', '**/*.html', '**/jest.config.js', '**/build/*', '**/*.d.ts', '**/lcov-report/*'] },
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        plugins: {
            'import-helpers': importHelpers,
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            'react/jsx-uses-vars': 'error',
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            '@typescript-eslint/no-unused-vars': ['warn'],
            '@typescript-eslint/no-explicit-any': ['off'],
            'no-multiple-empty-lines': ['error', { 'max': 1 }],
            'keyword-spacing': ['error', { 'before': true, 'after': true }],
            'object-curly-spacing': ['error', 'always'],
            'space-before-function-paren': ['error', {
                'anonymous': 'always',
                'named': 'never',
                'asyncArrow': 'always'
            }],
            'max-len': ['error', { 'code': 120 }],
            'import-helpers/order-imports': [
                'warn',
                {
                    newlinesBetween: 'always',
                    groups: [
                        ['/^react/'],
                        'module',
                        '/^@storybook/',
                        // '/^@mui/',
                        // '/^@(?!/)/',
                        '/^@minhas-financas/ui/',
                        '/^@minhas-financas/toolkit/',
                        '/^@minhas-financas/services/',
                        '/^@minhas-financas/context/',
                        '/^@minhas-financas/',
                        '/^@(?!minhas-financas)/',
                        ['parent', 'sibling', 'index'],
                        '/^~/',
                    ],
                }
            ]
        },
        settings: {
            react: {
                version: 'detect', // Detecta automaticamente a versão do React
            },
        },
    }
];