const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const { commonPlugin, webpackBaseConfig, baseConfig } = require('@lm/shared/src/config/vue')
const autoprefixer = require('autoprefixer') // 自动在样式中添加浏览器厂商前缀，避免手动处理样式兼容问题
const webpack = require('webpack')
const resolve = dir => path.join(__dirname, dir)
const name = require('./package.json').name
const config = baseConfig(process.env)

module.exports = defineConfig({
  ...config,
  configureWebpack: config => {
    webpackBaseConfig(process.env, config, resolve)
    config.externals = {
      BMap: 'window.BMap', // 百度地图
      AMap: 'AMap' // 高德地图
    }
    // 配置别名
    // config.resolve.alias = {
    //   ...(aliasConfigFn(resolve) || {})
    // }
    // config.plugins = [...config.plugins, ...commonPlugin, new webpack.ProvidePlugin({
    //   $: '@lm/shared/lib/src/utils'
    // })]

    // if (process.env.NODE_ENV === 'production') {
    //   config.output.filename = 'js/[name].[contenthash].js'
    //   config.output.chunkFilename = 'js/[name].[contenthash].js'
    // }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.optimization.minimize(true) // 开启压缩js代码
      config.optimization.splitChunks({
        // 开启代码分割
        chunks: 'all'
      })
    }
  }
})
