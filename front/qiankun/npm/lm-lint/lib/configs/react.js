"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactRules = void 0;
exports.reactRules = {
    'jsx-quotes': ['error', 'prefer-double'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-curly-newline': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-handler-names': 'off',
    'react/react-in-jsx-scope': 'off'
};
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true
    },
    plugins: ['react', 'react-hooks', 'unicorn'],
    extends: ['standard', 'standard-jsx', 'standard-react', require.resolve('./base')],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2021,
        sourceType: 'module'
    },
    rules: {
        'standard/no-callback-literal': 'off',
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: false
            }
        ],
        ...exports.reactRules
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    overrides: [
        {
            files: ['**/*.ts?(x)'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 'latest',
                ecmaFeatures: {
                    jsx: true
                },
                warnOnUnsupportedTypeScriptVersion: true
            },
            extends: [
                'standard',
                'standard-jsx',
                'standard-react',
                'plugin:@typescript-eslint/recommended'
            ],
            plugins: ['react', 'react-hooks', 'unicorn', '@typescript-eslint'],
            rules: {
                // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
                'default-case': 'off',
                // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
                'no-dupe-class-members': 'off',
                // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
                'no-undef': 'off',
                // Add TypeScript specific rules (and turn off ESLint equivalents)
                '@typescript-eslint/consistent-type-assertions': 'warn',
                'no-array-constructor': 'off',
                '@typescript-eslint/no-array-constructor': 'warn',
                '@typescript-eslint/no-namespace': 'error',
                'no-use-before-define': 'off',
                '@typescript-eslint/no-use-before-define': [
                    'error',
                    {
                        functions: false,
                        classes: false,
                        variables: false,
                        typedefs: false
                    }
                ],
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': 'warn',
                'no-useless-constructor': 'off',
                '@typescript-eslint/no-useless-constructor': 'warn',
                'react/prop-types': 'off',
                'standard/no-callback-literal': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/member-delimiter-style': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/quotes': [
                    'error',
                    'single',
                    {
                        avoidEscape: true,
                        allowTemplateLiterals: false
                    }
                ],
                ...exports.reactRules
            }
        }
    ]
};
