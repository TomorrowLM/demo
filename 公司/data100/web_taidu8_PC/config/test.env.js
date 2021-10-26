'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  BASE_URL: '"https://apitest.pinrenwu.cn"',
  BASE_PAGE: '"https://wwwtest.pinrenwu.cn"',
  LOGIN_BASE_PAGE: '"https://wwwtest.pinrenwu.cn/pc"',
  WX_LOGIN_REDIRECT_URI: '"https%3A%2F%2Fwwwtest.pinrenwu.cn%2fpc%2f%23%2fjump"',
})
