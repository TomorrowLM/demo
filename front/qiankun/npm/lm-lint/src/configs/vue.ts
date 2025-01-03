export const rules = {
  semi: [0, "never"],
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
  'no-unused-vars': 'off',
  'no-useless-constructor': 'off',
  'n/handle-callback-err': 'off',
  'n/no-callback-literal': 'off',

  'prefer-rest-params': 'off',
  'prefer-promise-reject-errors': 'off',
  'prefer-regex-literals': 'off',

  'unicorn/prefer-string-slice': 'off',
  'unicorn/prefer-number-properties': 'off',
  'unicorn/filename-case': 'off',

  // Add TypeScript specific rules (and turn off ESLint equivalents)
  '@typescript-eslint/no-unused-vars': 'warn',
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

  'vue/multi-word-component-names': 'off',
  'vue/no-v-html': 'off',
  'vue/require-default-prop': 'off',
  'vue/require-explicit-emits': 'off',
  'vue/prefer-import-from-vue': 'off',
  'vue/no-v-text-v-html-on-component': 'off',
  'vue/custom-event-name-casing': 'off',
  'vue/html-self-closing': [
    'error',
    {
      html: {
        void: 'always',
        normal: 'always',
        component: 'always'
      },
      svg: 'always',
      math: 'always'
    }
  ],
  'vue/no-unused-vars': 'off',
  'vue/valid-v-slot': 'off',
  'vue/no-v-model-argument': 'off',
  'vue/no-mutating-props': 'off', // TODO 其实不允许直修改 props
  'vue/no-parsing-error': 'off',
  'vue/no-deprecated-dollar-listeners-api': 'off',
  'vue/no-deprecated-v-on-native-modifier': 'off',
  'vue/no-deprecated-events-api': 'off',
  'vue/require-prop-types': 'off',
  'vue/no-reserved-component-names': 'off',
  'vue/no-v-for-template-key': 'off'
}

module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: ['standard', 'plugin:vue/recommended', require.resolve('./base')],
  plugins: ['unicorn','vue'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'standard',
        'plugin:vue/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
      ],
      plugins: ['unicorn', '@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        warnOnUnsupportedTypeScriptVersion: true
      },
      rules: {
        ...rules
      }
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      plugins: ['vue', 'unicorn', '@typescript-eslint'],
      extends: ['standard', 'plugin:vue/recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {
        ...rules
      }
    }
  ],
  rules: {},
  globals: {
    h: true,
    $: 'readonly' 
  }
}
