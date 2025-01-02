module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'plugin:@lm/eslint-plugin-lint/vue'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  }
}
