// 通过“中转站”plugin.ts 引入通用能力（优先 ts，其次 js），避免直接依赖 core
let pluginHelpers = require('./plugin.js')
let { getProjectName } = require('../core/scripts/getProjectPackageJson.js')
console.log('pluginHelpers', pluginHelpers.devServerProxyPlugin)
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
      ENV_CONFIG: require('../core/env')[process.env.NODE_ENV],
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
    console.log('aliasPlugin11', all);
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
    // 优先使用 consumer 提供的 webpack 实例（在创建 builder 时传入）
    // 回退：在运行时动态 require（使用 Function 防止打包器静态分析到 require）
    const webpackLocal = (this.options && this.options.webpack) || (() => {
      try {
        // 使用 Function 动态调用 require，避免打包器将 webpack 内联到产物中
        // eslint-disable-next-line no-new-func
        // return Function('return require("webpack")')();
      } catch (e) {
        // 没有可用的 webpack（例如在打包共享包时），降级返回空插件数组
        console.warn('[Vue2CliBuilder] webpack not available at runtime. Consumer should provide webpack via options.webpack to enable DefinePlugin.');
        return null;
      }
    })();

    if (!webpackLocal) return [];

    return [
      new webpackLocal.DefinePlugin({
        "process.env": this.GLOBAL_CONFIG.ENV_CONFIG
      }),
    ]
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
      configureWebpack(config) {
        config.resolve = config.resolve || {}
        config.output = config.output || {}
        config.plugins.push(...this.commonPluginFactory());
        // self.externalsPlugin(config)
        // // 用户自定义 configureWebpack 扩展（优先执行）
        // if (Array.isArray(self.options.configureExtenders)) {
        //   for (const extender of self.options.configureExtenders) {
        //     try {
        //       extender(config)
        //     } catch (e) {
        //       // eslint-disable-next-line no-console
        //       console.warn('[vue2.builder] configureExtender error:', (e && e.message) || e)
        //     }
        //   }
        // }
        // // 统一执行“configureWebpack”阶段插件（helpers 通过 plugin 中转）
        // self.runPlugins('configureWebpack', { config, helpers: pluginHelpers, options: self.options })
      },
      /**
       * 链式方式对 webpack 做精细化调整：
       * - 开发环境可开启 splitChunks
       * - 其余注入（如 CDN）通过插件体系完成
       */
      chainWebpack(config) {
        // 开发模式可选开启分包优化
        if (!self.GLOBAL_CONFIG.IS_PROD && self.options.enableSplitChunksInDev) {
          config.optimization.minimize(true)
          config.optimization.splitChunks({ chunks: 'all' })
        }
        self.aliasPluginFactory(config)
        console.log('createConfig', config)
      },
    }
  }
  getCdnAssets() {
    return pluginHelpers.normalizeCdnAssets ? pluginHelpers.normalizeCdnAssets(this.options.cdn || {}) : { css: (this.options.cdn && this.options.cdn.css) || [], js: (this.options.cdn && this.options.cdn.js) || [], externals: (this.options.cdn && this.options.cdn.externals) || {} }
  }
}

// 直接导出构造函数，避免懒加载问题
module.exports = Vue2CliBuilder
