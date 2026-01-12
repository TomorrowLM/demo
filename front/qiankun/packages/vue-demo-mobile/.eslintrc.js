module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'plugin:@lm/lint/lib/esLint/vue'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  }
}
