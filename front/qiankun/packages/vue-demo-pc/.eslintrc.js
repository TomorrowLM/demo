// const globals = require('@lm/eslint-plugin-lint/configs/vue')
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
  // globals
}
