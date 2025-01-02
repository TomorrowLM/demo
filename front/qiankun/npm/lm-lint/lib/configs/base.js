"use strict";
module.exports = {
    plugins: ['import', 'jsonc', 'unicorn'],
    extends: [
        'standard',
        'eslint:recommended',
        'plugin:markdown/recommended',
        'plugin:jsonc/recommended-with-jsonc'
    ],
    overrides: [
        {
            files: ['*.json', '*.json5', '*.jsonc'],
            parser: 'jsonc-eslint-parser'
        },
        {
            files: ['**/__tests__/**'],
            rules: {
                'no-console': 'off',
                'vue/one-component-per-file': 'off'
            }
        },
        {
            files: ['package.json'],
            parser: 'jsonc-eslint-parser',
            rules: {
                'jsonc/sort-keys': [
                    'error',
                    {
                        pathPattern: '^$',
                        order: [
                            'name',
                            'version',
                            'private',
                            'packageManager',
                            'description',
                            'type',
                            'keywords',
                            'homepage',
                            'bugs',
                            'license',
                            'author',
                            'contributors',
                            'funding',
                            'files',
                            'main',
                            'module',
                            'exports',
                            'unpkg',
                            'jsdelivr',
                            'browser',
                            'bin',
                            'man',
                            'directories',
                            'repository',
                            'publishConfig',
                            'scripts',
                            'peerDependencies',
                            'peerDependenciesMeta',
                            'optionalDependencies',
                            'dependencies',
                            'devDependencies',
                            'engines',
                            'config',
                            'overrides',
                            'pnpm',
                            'husky',
                            'lint-staged',
                            'eslintConfig'
                        ]
                    },
                    {
                        pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
                        order: { type: 'asc' }
                    }
                ]
            }
        },
        {
            files: ['**/*.md/*.js', '**/*.md/*.ts'],
            rules: {
                'import/no-unresolved': 'off'
            }
        }
    ],
    rules: {
        // js/ts
        camelcase: 'off',
        // semi: 1,
        'no-console': ['off', { allow: ['error'] }],
        'no-debugger': 'warn',
        'no-constant-condition': ['error', { checkLoops: false }],
        'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
        'no-return-await': 'error',
        'no-var': 'error',
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-unused-vars': 'warn',
        'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],
        'prefer-const': ['warn', { destructuring: 'all', ignoreReadBeforeAssign: true }],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'prefer-rest-params': 'warn',
        // best-practice
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'no-alert': 'warn',
        'no-case-declarations': 'off',
        'no-multi-str': 'error',
        'no-with': 'error',
        'no-void': 'off',
        'sort-imports': [
            'warn',
            {
                ignoreCase: false,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                allowSeparatedGroups: false
            }
        ],
        // stylistic-issues
        'prefer-exponentiation-operator': 'error',
        // import
        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                pathGroups: [
                    {
                        pattern: 'vue',
                        group: 'external',
                        position: 'before'
                    },
                    {
                        pattern: '@vue/**',
                        group: 'external',
                        position: 'before'
                    },
                    {
                        pattern: '@element/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@element-plus/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@/router/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@/store/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@/mixins/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@/api/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@/mock/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@/components/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@/views/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@/hooks/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@/utils/**',
                        group: 'internal',
                        position: 'before'
                    },
                    {
                        pattern: '@/**',
                        group: 'internal',
                        position: 'before'
                    }
                ],
                pathGroupsExcludedImportTypes: ['type'],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
                    caseInsensitive: true /* ignore case. Options: [true, false] */
                }
            }
        ],
        'import/no-unresolved': 'off',
        'import/namespace': 'off',
        'import/default': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/named': 'off',
        // unicorn
        'unicorn/filename-case': [
            'warn',
            {
                cases: {
                    camelCase: true,
                    pascalCase: true,
                    kebabCase: true
                }
            }
        ],
        'unicorn/custom-error-definition': 'error',
        'unicorn/error-message': 'error',
        'unicorn/escape-case': 'error',
        'unicorn/import-index': 'error',
        'unicorn/new-for-builtins': 'error',
        'unicorn/no-array-method-this-argument': 'error',
        'unicorn/no-array-push-push': 'error',
        'unicorn/no-console-spaces': 'error',
        'unicorn/no-for-loop': 'error',
        'unicorn/no-hex-escape': 'error',
        'unicorn/no-instanceof-array': 'error',
        'unicorn/no-new-array': 'error',
        'unicorn/no-new-buffer': 'error',
        'unicorn/no-unsafe-regex': 'off',
        'unicorn/number-literal-case': 'off',
        'unicorn/prefer-array-flat-map': 'error',
        'unicorn/prefer-array-index-of': 'error',
        'unicorn/prefer-array-some': 'error',
        'unicorn/prefer-date-now': 'error',
        'unicorn/prefer-dom-node-dataset': 'error',
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-keyboard-event-key': 'error',
        'unicorn/prefer-math-trunc': 'error',
        'unicorn/prefer-modern-dom-apis': 'error',
        'unicorn/prefer-negative-index': 'error',
        'unicorn/prefer-number-properties': 'error',
        'unicorn/prefer-optional-catch-binding': 'error',
        'unicorn/prefer-prototype-methods': 'error',
        'unicorn/prefer-query-selector': 'error',
        'unicorn/prefer-reflect-apply': 'error',
        'unicorn/prefer-string-slice': 'error',
        'unicorn/prefer-string-starts-ends-with': 'error',
        'unicorn/prefer-string-trim-start-end': 'error',
        'unicorn/prefer-type-error': 'error',
        'unicorn/throw-new-error': 'error'
    }
};
