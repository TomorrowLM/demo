export const rules = {
  'standard/no-callback-literal': 'off',

  // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
  'default-case': 'off',
  // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
  'no-dupe-class-members': 'off',
  // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
  'no-undef': 'off',
  'no-new': 'off',
  'no-array-constructor': 'off',
  'no-use-before-define': 'off',
  'no-useless-constructor': 'off',
  'no-var': 'error',
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-void': 'off',
  'no-constant-condition': ['error', { checkLoops: false }],
  'no-unused-vars': 'off',
  'prefer-const': ['warn', { destructuring: 'all', ignoreReadBeforeAssign: true }],
  'prefer-template': 'error',
  'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],
  'block-scoped-var': 'error',

  'n/handle-callback-err': 'off',
  'n/no-callback-literal': 'off',

  'prefer-rest-params': 'off',
  'prefer-promise-reject-errors': 'off',
  'prefer-regex-literals': 'off',

  'unicorn/prefer-string-slice': 'off',
  'unicorn/prefer-number-properties': 'off',
  'unicorn/filename-case': 'off',

  // Add TypeScript specific rules (and turn off ESLint equivalents)
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/consistent-type-assertions': 'warn',
  '@typescript-eslint/no-array-constructor': 'warn',
  '@typescript-eslint/no-namespace': 'error',
  '@typescript-eslint/no-use-before-define': [
    'error',
    {
      functions: false,
      classes: false,
      variables: false,
      typedefs: false
    }
  ],
  '@typescript-eslint/no-useless-constructor': 'warn',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/member-delimiter-style': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/no-this-alias': 'off',
  quotes: 'off',
  '@typescript-eslint/quotes': [
    'error',
    'single',
    {
      avoidEscape: true,
      allowTemplateLiterals: false
    }
  ],
  '@typescript-eslint/no-redeclare': 'error',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
  // '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/ban-ts-ignore': 'off',

  // vue
  'vue/require-default-prop': 'off',
  'vue/require-explicit-emits': 'off',
  'vue/no-unused-vars': 'off',
  'vue/multi-word-component-names': 'off',
  'vue/script-setup-uses-vars': 'error',
  'vue/no-reserved-component-names': 'off',
  'vue/custom-event-name-casing': 'off',
  'vue/attributes-order': 'off',
  'vue/one-component-per-file': 'off',
  'vue/html-closing-bracket-newline': 'off',
  'vue/max-attributes-per-line': 'off',
  'vue/multiline-html-element-content-newline': 'off',
  'vue/singleline-html-element-content-newline': 'off',
  'vue/attribute-hyphenation': 'off',
  'vue/html-self-closing': [
    'error',
    {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always'
      },
      svg: 'always',
      math: 'always'
    }
  ],
  'vue/no-v-html': 'off'
}

module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true
  },
  plugins: ['unicorn'],
  extends: [require.resolve('./base')],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
          tsx: true
        }
      },
      extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended'
      ],
      plugins: ['@typescript-eslint'],
      rules: {
        ...rules
      }
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        jsxPragma: 'React',
        ecmaFeatures: {
          jsx: true,
          tsx: true
        }
      },
      plugins: ['vue', '@typescript-eslint'],
      extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended'
      ],
      rules: {
        ...rules
      }
    },
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      rules: {
        'no-undef': 'off'
      }
    }
  ]
}
