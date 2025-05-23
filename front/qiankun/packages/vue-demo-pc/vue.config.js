const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const autoprefixer = require('autoprefixer') // 自动在样式中添加浏览器厂商前缀，避免手动处理样式兼容问题
const webpack = require('webpack')
const resolve = dir => path.join(__dirname, dir)
const packageName = require('./package.json').name

const { webpackBaseConfig, baseConfig } = require('@lm/shared/src/config/vue')
const { qiankunConfigFn, configAsset } = require('@lm/shared/src/config/qiankun')
const isQiankun = process.env.VUE_APP_IS_QIANKUN === 'true'
const config = baseConfig(process.env)

module.exports = defineConfig({
  ...config,
  // publicPath: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8002',
  configureWebpack: config => {
    webpackBaseConfig(process.env, config, resolve)
    config.externals = {
      BMap: 'window.BMap', // 百度地图
      AMap: 'AMap' // 高德地图
    }
    isQiankun && qiankunConfigFn({ projectName: 'web2', config })
  },
  chainWebpack: config => {
    if (isQiankun) {
      // configAsset(config)
    }
    if (process.env.NODE_ENV === 'development') {
      config.optimization.minimize(true) // 开启压缩js代码
      config.optimization.splitChunks({
        // 开启代码分割
        chunks: 'all'
      })
    }
  }
})
