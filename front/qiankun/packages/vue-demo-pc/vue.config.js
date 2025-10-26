const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const autoprefixer = require('autoprefixer') // 自动在样式中添加浏览器厂商前缀，避免手动处理样式兼容问题
const {
  buildConfig,
  LM_ENV_CONFIG
} = require('@lm/shared/config')
const resolve = dir => path.join(__dirname, dir)

console.log('vue.config');
console.log('LM_ENV_CONFIG', LM_ENV_CONFIG)
const isQiankun = process.env.VUE_APP_IS_QIANKUN === 'true'

module.exports = defineConfig({
  ...config,
  configureWebpack: config => {
    config.plugins = config.plugins || [];
    // config.plugins.push(new webpack.DefinePlugin({
    //   'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV || ''),
    //   'process.env.RUNTIME_APP_ENV': JSON.stringify(process.env.APP_ENV || '')
    // }));
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
