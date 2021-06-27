module.exports = {
  // environment
  env: {
    browser: true,
    es6: true
  },
  extends: ['airbnb', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  // parser params
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 10,
    sourceType: 'module'
  },
  plugins: ['react', 'prettier'],
  rules: {
    // "off":0
    // "warn":1
    // "error":2
    'prettier/prettier': 'error',
    'no-shadow': 0,
    semi: ['error', 'never'],
    'no-param-reassign': 0,
    quotes: ['error', 'single'],
    'max-len': [
      0,
      {
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      }
    ],
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.jsx']
      }
    ],
    'react/static-property-placement': 0,
    'react/prefer-stateless-function': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-danger': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'consistent-return': 0
  }
}
