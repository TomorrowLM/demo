// 通过“中转站”plugin.ts 引入通用能力（优先 ts，其次 js），避免直接依赖 core
let pluginHelpers = require('./plugin.js')
let { getDependency, getProjectName } = require('../core/scripts/app.js')
let { getEnvConfig } = require('../core/scripts/env.js')

/**
 * Vue CLI Vue2 构建类
 */
class Vue2CliBuilder {
  constructor(options = {}) {
    this.options = {
      htmlInjectCdn: true,
      ...options,
    }
    this.GLOBAL_CONFIG = {
      ENV_CONFIG: getEnvConfig(process.env.NODE_ENV),
      NODE_ENV: process.env.NODE_ENV,
      IS_PROD: (process.env.APP_ENV || process.env.NODE_ENV) === 'production',
      PROJECT_NAME: getProjectName()
    }
    console.log('GLOBAL_CONFIG', this.GLOBAL_CONFIG);
    this._plugins = []
  }
  externalsPlugin() {
    const map = {}
    if (this.options && this.options.externals) Object.assign(map, this.options.externals)
    if (this.options && this.options.cdn && this.options.cdn.externals) Object.assign(map, this.options.cdn.externals)
    if (Object.keys(map).length === 0) return this
  }
  aliasPluginFactory(config) {
    // 使用helpers工具类处理所有别名，返回处理后的别名对象
    const all = pluginHelpers.aliasPlugin()
    // 遍历处理后的别名对象
    Object.keys(all).forEach(key => {
      // 为Webpack配置设置每个别名映射
      config.resolve.alias.set(key, all[key]);
    })
  }
  devServerProxyPluginFactory() {
    return pluginHelpers.devServerProxyPlugin(this.GLOBAL_CONFIG)
  }

  commonPluginFactory() {
    const webpack = getDependency('webpack', this.options);
    if (!webpack) return [];
    const defines = {};
    const env = this.GLOBAL_CONFIG && this.GLOBAL_CONFIG.ENV_CONFIG ? this.GLOBAL_CONFIG.ENV_CONFIG : {};
    // 按键注入 process.env.KEY 的形式，避免覆盖整个 process.env
    Object.keys(env).forEach(key => {
      defines[`process.env.${key}`] = JSON.stringify(env[key]);
    });
    // 确保 NODE_ENV 存在
    if (!defines['process.env.NODE_ENV']) {
      defines['process.env.NODE_ENV'] = JSON.stringify(this.GLOBAL_CONFIG && this.GLOBAL_CONFIG.NODE_ENV || process.env.NODE_ENV);
    }
    return [
      new webpack.DefinePlugin(defines),
    ];
  }
  createConfig() {
    const self = this
    return {
      // 合并已有的基础配置
      devServer: self.devServerProxyPluginFactory(this.options),
      /**
       * 直接访问 webpack 配置对象：应用公共别名、公用插件与文件命名策略等
       * 对应实现参考：vue-cli.webpackBaseConfig()
       */
      configureWebpack: (config) => {
        config.resolve = config.resolve || {}
        config.output = config.output || {}
        console.log('configureWebpack config:', self.commonPluginFactory())
        config.plugins.push(...self.commonPluginFactory());
      },
      /**
       * 链式方式对 webpack 做精细化调整：
       * - 开发环境可开启 splitChunks
       * - 其余注入（如 CDN）通过插件体系完成
       */
      chainWebpack: (config) => {
        // 开发模式可选开启分包优化
        if (!self.GLOBAL_CONFIG.IS_PROD && self.options.enableSplitChunksInDev) {
          config.optimization.minimize(true)
          config.optimization.splitChunks({ chunks: 'all' })
        }
        self.aliasPluginFactory(config)
      },
    }
  }
  getCdnAssets() {
    return pluginHelpers.normalizeCdnAssets ? pluginHelpers.normalizeCdnAssets(this.options.cdn || {}) : { css: (this.options.cdn && this.options.cdn.css) || [], js: (this.options.cdn && this.options.cdn.js) || [], externals: (this.options.cdn && this.options.cdn.externals) || {} }
  }
}

// 直接导出构造函数，避免懒加载问题
module.exports = Vue2CliBuilder
