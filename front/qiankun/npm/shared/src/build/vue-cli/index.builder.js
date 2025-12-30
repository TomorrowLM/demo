// 通过“中转站”plugin.ts 引入通用能力（优先 ts，其次 js），避免直接依赖 core
let pluginHelpers = require('./plugin.js')
let helpers = pluginHelpers.helpers;
let { getProjectInfo } = require('../core/scripts/app.js')
let { getEnvConfig } = require('../core/scripts/env.js')
let QiankunClass = require('../qiankun/index.js')

/**
 * Vue CLI Vue2 构建类
 */
class Vue2CliBuilder {
  constructor(options = {}) {
    const env = getEnvConfig(process.env.NODE_ENV);
    this.options = Object.assign({}, options, {
      htmlInjectCdn: true,
    });

    this.GLOBAL_CONFIG = {
      ENV_CONFIG: env,
      APP_INFO: getProjectInfo(),
      NODE_ENV: process.env.NODE_ENV,
      IS_PROD: env.IS_PROD,
      IS_QIANKUN: env.IS_QIANKUN,
    }
    this._plugins = [];
    this.QiankunInstance = new QiankunClass(this.options); // 初始化 qiankun 实例
  }
  // 
  externalsPlugin() {
    const map = {}
    if (this.options && this.options.externals) Object.assign(map, this.options.externals)
    if (this.options && this.options.cdn && this.options.cdn.externals) Object.assign(map, this.options.cdn.externals)
    if (Object.keys(map).length === 0) return this
  }
  // 注入别名插件工厂方法
  aliasPluginFactory(config) {
    // 使用helpers工具类处理所有别名，返回处理后的别名对象
    const all = pluginHelpers.aliasPlugin()
    // 遍历处理后的别名对象
    Object.keys(all).forEach(key => {
      // 为Webpack配置设置每个别名映射
      config.resolve.alias.set(key, all[key]);
    })
  }
  // 通用插件工厂方法
  commonPluginFactory() {
    return [helpers.fetchDefinePlugin()];
  }
  getTools() {
    return {
      // 注入CDN资源
      getCdnAssets: () => {
        return pluginHelpers.normalizeCdnAssets ? pluginHelpers.normalizeCdnAssets(this.options.cdn || {}) : { css: (this.options.cdn && this.options.cdn.css) || [], js: (this.options.cdn && this.options.cdn.js) || [], externals: (this.options.cdn && this.options.cdn.externals) || {} }
      },
      getPublicPath: () => {
        const { IS_PROD, IS_QIANKUN, Build_Path, Build_Qiankun_Path } = this.GLOBAL_CONFIG.ENV_CONFIG;
        if (!IS_PROD || !IS_QIANKUN) return '/';
        // 正式环境且非微应用模式，则使用打包路径作为资源访问路径
        if (!IS_PROD || IS_QIANKUN) return Build_Path;

        return IS_PROD && !IS_QIANKUN ? Build_Path : Build_Qiankun_Path
      },
    }
  }
  createConfig() {
    const self = this
    return {
      publicPath: self.getTools().getPublicPath(),
      css: {
        extract: {
          ignoreOrder: true, //解决组件的引入必须先后顺序一致
        }, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: false,
        loaderOptions: {
          scss: {
            additionalData: `@import "@lm/shared/assets/styles/index.scss";`, //注入全局样式
          },
        },
      },
      // 合并已有的基础配置
      devServer: helpers.fetchProxyEntry(this.GLOBAL_CONFIG),
      /**
       * 直接访问 webpack 配置对象：应用公共别名、公用插件与文件命名策略等
       * 对应实现参考：vue-cli.webpackBaseConfig()
       */
      configureWebpack: (config) => {
        config.resolve = config.resolve || {}
        config.output = config.output || {}
        config.plugins.push(...self.commonPluginFactory());
        if (self.GLOBAL_CONFIG.ENV_CONFIG.IS_QIANKUN) {
          self.QiankunInstance.setOutputConfig(config);
        }
      },
      /**
       * 链式方式对 webpack 做精细化调整：
       * - 开发环境可开启 splitChunks
       * - 其余注入（如 CDN）通过插件体系完成
       */
      chainWebpack: (config) => {
        // 开发模式可选开启分包优化
        if (!self.GLOBAL_CONFIG.ENV_CONFIG.IS_PROD) {
          config.optimization.minimize(true)
          config.optimization.splitChunks({ chunks: 'all' })
        }
        self.aliasPluginFactory(config)

        // 在 qiankun 场景下，为字体等静态资源配置带前缀的 publicPath
        // 例如：/vue2-pc/fonts/ 或 /qiankun/child/vue2-pc/fonts/
        if (this.GLOBAL_CONFIG.IS_QIANKUN) {
          self.QiankunInstance.configureAssets(config)
        }
      },
    }
  }
}

// 直接导出构造函数，避免懒加载问题
module.exports = Vue2CliBuilder
