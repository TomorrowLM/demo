module.exports = {
  root: true,
  // extends: ['plugin:@lm/lint/js'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    semi: [0, "never"]
  }
}
