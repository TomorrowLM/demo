module.exports = {
  root: true,
  // extends: ['plugin:@lm/eslint-plugin-lint/js'],
  parserOptions: {
    ecmaVersion: 2015, // 或更高版本
    sourceType: 'module'
  },
  rules: {
    semi: [0, "never"]
  }
}
