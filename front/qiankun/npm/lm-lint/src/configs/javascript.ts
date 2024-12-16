module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: [require.resolve('./base')],
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
    'quotes': [0, 'single'],
    // quotes: [
    //   'error',
    //   'single',
    //   {
    //     avoidEscape: true,
    //     allowTemplateLiterals: false
    //   }
    // ],
    'n/handle-callback-err': 'off',
    'n/no-callback-literal': 'off'
  }
}
