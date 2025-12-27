// 通过“中转站”plugin.ts 引入通用能力（优先 ts，其次 js），避免直接依赖 core
let pluginHelpers = require('./plugin.js')
let { getProjectInfo } = require('../core/scripts/app.js')
let { getEnvConfig } = require('../core/scripts/env.js')
let QiankunClass = require('../qiankun/index.js')

/**
 * Vue CLI Vue2 构建类
 */
class Vue2CliBuilder {
  constructor(options = {}) {
    this.options = Object.assign({}, options, {
      htmlInjectCdn: true,
    });
    this.GLOBAL_CONFIG = {
      ENV_CONFIG: getEnvConfig(process.env.NODE_ENV),
      APP_INFO: getProjectInfo(),
      NODE_ENV: process.env.NODE_ENV,
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
  // 代理插件工厂方法
  devServerProxyPluginFactory() {
    return pluginHelpers.devServerProxyPlugin(this.GLOBAL_CONFIG.APP_INFO.APP_NAME)
  }
  // 通用插件工厂方法
  commonPluginFactory() {
    // const webpack = getDependency('webpack', this.options);
    // if (!webpack) return [];
    // // 确保 NODE_ENV 存在
    // if (!defines['process.env.NODE_ENV']) {
    //   defines['process.env.NODE_ENV'] = JSON.stringify(this.GLOBAL_CONFIG && this.GLOBAL_CONFIG.NODE_ENV || process.env.NODE_ENV);
    // }
    return [
      // new webpack.DefinePlugin(defines),
      ...this.getTools().setDefinePlugin()
    ];
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
      setDefinePlugin: () => {
        console.log('setDefinePlugin called');
        const webpack = require('webpack');
        const env = this.GLOBAL_CONFIG && this.GLOBAL_CONFIG.ENV_CONFIG ? this.GLOBAL_CONFIG.ENV_CONFIG : {};
        const defines = {
          GLOBAL_INFO: JSON.stringify(env),
        };
        // 按键注入 process.env.KEY 的形式，避免覆盖整个 process.env
        // Object.keys(env).forEach(key => {
        //   defines[`APP_${key}`] = JSON.stringify(env[key]);
        // });
        console.log('webpack loaded:', defines, !!webpack);
        // console.log('webpack loaded:', webpack);
        return [new webpack.DefinePlugin(defines)]
      }
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
      devServer: self.devServerProxyPluginFactory(this.options),
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
      },
    }
  }
}

// 直接导出构造函数，避免懒加载问题
module.exports = Vue2CliBuilder
