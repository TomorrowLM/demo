'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"https://apitest.pinrenwu.cn"',
  BASE_PAGE: '"https://wwwtest.pinrenwu.cn"',
  LOGIN_BASE_PAGE: '"https://wwwtest.pinrenwu.cn/pc"',
  WX_LOGIN_REDIRECT_URI: '"https%3a%2f%wwwtest.pinrenwu.cn%2fpc%2f%23%2fjump"',
})
