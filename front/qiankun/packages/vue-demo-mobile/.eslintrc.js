module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'plugin:@lm/eslint-plugin-lint/vue'
  ],
  rules: {
    semi: [0, "never"]
  }
}
