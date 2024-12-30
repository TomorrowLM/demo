const globals = require('@lm/npm/eslint-plugin-lint/configs/vue').globals
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'plugin:@lm/npm/eslint-plugin-lint/configs/vue'
  ],  
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals
}
