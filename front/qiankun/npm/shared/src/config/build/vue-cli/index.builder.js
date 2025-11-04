/**
 * Vue CLI 下的 Vue2 构建类（CommonJS 版本）
 * 目标：
 * 1) 适配 ./index.ts 能力：CDN externals、别名扩展、CSS 注入、DevServer 代理可调
 * 2) 通用 Webpack 能力沉淀在 core，并由 plugin.ts 作为“中转站”适配到 Vue2 生命周期
 * 3) 插件体系（use/runPlugins/externalsPlugin），支持以插件方式扩展构建逻辑
 * 4) 新增插件“命名 + 优先级 + 去重”机制：use(fn, { name, order })，按 order 升序执行；同名覆盖去重
 *
 * 使用（在各项目的 vue.config.js 中）：
 *   const { defineConfig } = require('@vue/cli-service')
 *   const Vue2CliBuilder = require('@lm/shared/config/build/vue-cli/index.builder.js')
 *   const builder = new Vue2CliBuilder({
 *     externals: { BMap: 'window.BMap', AMap: 'AMap' },
 *     alias: { '@components': path.resolve(__dirname, 'src/components') },
 *     css: { loaderOptions: { sass: { additionalData: '@import "~@/styles/index.scss";' } } },
 *     proxyRules: [{ baseUrl: '/api', target: 'http://localhost:3000' }],
 *     cdn: { externals: { vue: 'Vue' }, js: ['//cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js'] },
 *   })
 *   // 可选：以插件方式扩展
 *   const vue2Plugins = require('@lm/shared/config/build/vue-cli/plugin.ts')
 *   builder
 *     .use(vue2Plugins.definePlugin({ __APP_VERSION__: JSON.stringify('1.0.0') }), { name: 'define', order: 40 })
 *   module.exports = defineConfig(builder.createConfig())
 */

const path = require('path')

// 通过“中转站”plugin.ts 引入通用能力（优先 ts，其次 js），避免直接依赖 core
let vue2Plugins = null
vue2Plugins = require('./plugin.js')

// 兜底 helpers：从 plugin.ts 默认导出或属性中取得，若失败再保底引 core（不建议，尽量通过 plugin 中转）
let pluginHelpers =
  (vue2Plugins && (vue2Plugins.helpers || (vue2Plugins.default && vue2Plugins.default.helpers))) ||
  null
if (!pluginHelpers) {
  try {
    // 极端兜底：仅在未编译 plugin.ts 且调用方仍需运行时
    pluginHelpers = require('../core/webpack.helpers.js')
    // eslint-disable-next-line no-console
    console.warn('[vue2.builder] fallback to core helpers, please compile plugin.ts to js for full compatibility.')
  } catch (e) {
    pluginHelpers = {
      deepMerge: (a, b) => Object.assign({}, a || {}, b || {}),
      mergeDevServer: (a, b) => Object.assign({}, a || {}, b || {}),
      createProxyEntry: (baseUrl, target) => ({ [baseUrl]: { target, changeOrigin: true, secure: false, xfwd: false, pathRewrite: { [baseUrl]: '/' } } }),
      normalizeCdnAssets: (cdn) => ({ css: (cdn && cdn.css) || [], js: (cdn && cdn.js) || [], externals: (cdn && cdn.externals) || {} }),
      mergeAliases: (config, alias) => {
        config.resolve = config.resolve || {}
        config.resolve.alias = { ...(config.resolve.alias || {}), ...(alias || {}) }
      },
      mergeExternals: (config, ex) => {
        config.externals = { ...(config.externals || {}), ...(ex || {}) }
      },
      addDefinePlugin: () => { },
      addProvidePlugin: () => { },
    }
  }
}

// 提取插件工厂（如 externalsPlugin/aliasPlugin/...），若获取失败则提供软降级版本
const externalsPluginFactory =
  (vue2Plugins && (vue2Plugins.externalsPlugin || (vue2Plugins.default && vue2Plugins.default.externalsPlugin))) ||
  ((map = {}) => (ctx) => {
    if (ctx.stage === 'configureWebpack' && ctx.config && pluginHelpers.mergeExternals) {
      pluginHelpers.mergeExternals(ctx.config, map || {})
    }
  })

const aliasPluginFactory =
  (vue2Plugins && (vue2Plugins.aliasPlugin || (vue2Plugins.default && vue2Plugins.default.aliasPlugin))) ||
  ((alias = {}) => (ctx) => {
    if (ctx.stage === 'configureWebpack' && ctx.config && pluginHelpers.mergeAliases) {
      pluginHelpers.mergeAliases(ctx.config, alias || {})
    }
  })

const definePluginFactory =
  (vue2Plugins && (vue2Plugins.definePlugin || (vue2Plugins.default && vue2Plugins.default.definePlugin))) ||
  ((defs = {}) => (ctx) => {
    if (ctx.stage === 'configureWebpack' && ctx.config && pluginHelpers.addDefinePlugin) {
      pluginHelpers.addDefinePlugin(ctx.config, defs || {})
    }
  })

const providePluginFactory =
  (vue2Plugins && (vue2Plugins.providePlugin || (vue2Plugins.default && vue2Plugins.default.providePlugin))) ||
  ((prov = {}) => (ctx) => {
    if (ctx.stage === 'configureWebpack' && ctx.config && pluginHelpers.addProvidePlugin) {
      pluginHelpers.addProvidePlugin(ctx.config, prov || {})
    }
  })

const htmlCdnPluginFactory =
  (vue2Plugins && (vue2Plugins.htmlCdnPlugin || (vue2Plugins.default && vue2Plugins.default.htmlCdnPlugin))) ||
  ((cdn = {}) => (ctx) => {
    if (ctx.stage !== 'chainWebpack' || !ctx.chain) return
    const norm = pluginHelpers.normalizeCdnAssets ? pluginHelpers.normalizeCdnAssets(cdn || {}) : { css: cdn.css || [], js: cdn.js || [] }
    try {
      ctx.chain.plugin('html').tap((args) => {
        const a0 = args[0] || {}
        a0.cdn = a0.cdn || {}
        a0.cdn.css = Array.isArray(a0.cdn.css) ? a0.cdn.css : []
        a0.cdn.js = Array.isArray(a0.cdn.js) ? a0.cdn.js : []
        a0.cdn.css.push(...(norm.css || []))
        a0.cdn.js.push(...(norm.js || []))
        args[0] = a0
        return args
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[vue2.builder] html cdn inject skipped:', (e && e.message) || e)
    }
  })

const devServerProxyPluginFactory =
  (vue2Plugins && (vue2Plugins.devServerProxyPlugin || (vue2Plugins.default && vue2Plugins.default.devServerProxyPlugin))) ||
  ((rules = []) => (ctx) => {
    if (ctx.stage !== 'configureWebpack' || !ctx.config) return
    if (!Array.isArray(rules) || !rules.length) return
    const patch = {}
    for (const rule of rules) {
      if (!rule || !rule.baseUrl || !rule.target) continue
      const entry = pluginHelpers.createProxyEntry ? pluginHelpers.createProxyEntry(rule.baseUrl, rule.target, rule.opts) : { [rule.baseUrl]: { target: rule.target } }
      Object.assign(patch, entry)
    }
    ctx.config.devServer = ctx.config.devServer || {}
    ctx.config.devServer.proxy = { ...(ctx.config.devServer.proxy || {}), ...patch }
  })

// 统一环境对象（从每个项目 $lm-config/env 下读取配置，已经由 build/env/index.ts 处理）
const LM_ENV_CONFIG = require('../core/env')

/**
 * @typedef {Object} Vue2CliBuilderOptions
 * @property {boolean} [isMobile]
 * @property {Record<string, any>} [externals]
 * @property {Record<string, string>} [alias]
 * @property {Record<string, any>} [define]
 * @property {Record<string, any>} [provide]
 * @property {{ externals?: Record<string,string>, css?: string[], js?: string[] }} [cdn]
 * @property {boolean} [htmlInjectCdn=true]
 * @property {Record<string, any>} [css]
 * @property {Array<{ baseUrl: string, target: string, opts?: any }>} [proxyRules]
 * @property {Record<string, any>} [devServer]
 * @property {boolean} [enableSplitChunksInDev]
 * @property {Array<Function>} [chainExtenders]
 * @property {Array<Function>} [configureExtenders]
 */

/**
 * Vue CLI Vue2 构建类
 */
class Vue2CliBuilder {
  /**
   * @param {Vue2CliBuilderOptions} options
   */
  constructor(options = {}) {
    this.options = {
      htmlInjectCdn: true,
      ...options,
    }
    /**
     * 插件系统：通过 use(fn,{name,order}) 注册；按 order 升序执行；同名覆盖去重
     * stage: 'configureWebpack' | 'chainWebpack'
     */
    this._plugins = []
    this._pluginMap = new Map() // name -> { name, order, fn }
    this._autoId = 0
  }

  /**
   * 注册插件函数（支持命名、优先级与去重）
   * @param {(ctx:{stage:'configureWebpack'|'chainWebpack',config?:any,chain?:any,helpers:any,options:any})=>void} pluginFn
   * @param {{name?:string, order?:number}} [meta]
   * @returns {Vue2CliBuilder}
   */
  use(pluginFn, meta = {}) {
    if (typeof pluginFn !== 'function') return this
    const name = (meta && meta.name) || pluginFn.__name__ || pluginFn.name || `p${this._autoId++}`
    const order = Number.isFinite(meta && meta.order) ? Number(meta.order) : 100
    const rec = { name, order, fn: pluginFn }
    if (this._pluginMap.has(name)) {
      // 同名覆盖（去重）
      this._pluginMap.set(name, rec)
      const idx = this._plugins.findIndex((x) => x.name === name)
      if (idx >= 0) this._plugins[idx] = rec
    } else {
      this._pluginMap.set(name, rec)
      this._plugins.push(rec)
    }
    // 按优先级排序，次序相同按名称稳定排序
    this._plugins.sort((a, b) => (a.order - b.order) || String(a.name).localeCompare(String(b.name)))
    return this
  }

  /**
   * 运行插件（内部调用）
   * @param {'configureWebpack'|'chainWebpack'} stage
   * @param {Record<string, any>} ctx
   */
  runPlugins(stage, ctx) {
    if (!Array.isArray(this._plugins) || !this._plugins.length) return
    for (const rec of this._plugins) {
      const fn = rec && rec.fn
      try {
        fn && fn({ stage, ...ctx })
      } catch (e) {
        // 插件失败不应阻断构建
        // eslint-disable-next-line no-console
        console.warn(`[vue2.builder] plugin "${rec.name}" error:`, (e && e.message) || e)
      }
    }
  }

  /**
   * 预置：externals 插件（从 options.externals 与 options.cdn.externals 生成）
   * - 以插件形式合并到 webpack.externals，便于后续统一管理
   */
  externalsPlugin() {
    const map = {}
    if (this.options && this.options.externals) Object.assign(map, this.options.externals)
    if (this.options && this.options.cdn && this.options.cdn.externals) Object.assign(map, this.options.cdn.externals)
    if (Object.keys(map).length === 0) return this
    // 注册到插件体系（命名+优先级）
    return this.use(externalsPluginFactory(map), { name: 'externals', order: 30 })
  }

  /**
   * 生成可直接作为 vue.config.js 导出的配置对象
   * - 复用已有 baseConfig 逻辑，保持与历史项目一致
   * - 在 configureWebpack 中套用 webpackBaseConfig（别名、Provide/Define、文件名规则等）
   * - 在 chainWebpack 中按需追加优化（CDN 注入等）
   * - 顶层对象合并 css/devServer，支持 proxyRules 生成
   * - 执行预置插件 externalsPlugin，并在生命周期中统一触发插件
   */
  createConfig() {
    // 基础配置：publicPath/outputDir/sourceMap/devServer/css ...
    const base = {}

    const isProd = (process.env.APP_ENV || process.env.NODE_ENV) === 'production'
    const isDev = !isProd
    const isQiankun = process.env.VUE_APP_IS_QIANKUN === 'true'
    const self = this

    // 预置与选配插件注册（命名+优先级建议：proxy=10, alias=20, externals=30, define=40, provide=50, htmlCdn=60）
    this.externalsPlugin()
    if (self.options && self.options.alias) this.use(aliasPluginFactory(self.options.alias), { name: 'alias', order: 20 })
    if (self.options && self.options.define) this.use(definePluginFactory(self.options.define), { name: 'define', order: 40 })
    if (self.options && self.options.provide) this.use(providePluginFactory(self.options.provide), { name: 'provide', order: 50 })
    if (self.options && self.options.htmlInjectCdn !== false && self.options.cdn) {
      this.use(htmlCdnPluginFactory(self.options.cdn), { name: 'htmlCdn', order: 60 })
    }
    if (Array.isArray(self.options.proxyRules) && self.options.proxyRules.length) {
      this.use(devServerProxyPluginFactory(self.options.proxyRules), { name: 'devProxy', order: 10 })
    }

    // 1) 顶层 css 合并
    const mergedCss = pluginHelpers.deepMerge ? pluginHelpers.deepMerge(base.css || {}, self.options.css || {}) : { ...(base.css || {}), ...(self.options.css || {}) }

    // 2) DevServer：先基于 base.devServer，按 proxyRules 生成条目，再合并自定义 devServer
    let finalDevServer = base.devServer || {}
    if (Array.isArray(self.options.proxyRules) && self.options.proxyRules.length) {
      const proxyPatch = {}
      for (const rule of self.options.proxyRules) {
        if (!rule || !rule.baseUrl || !rule.target) continue
        const entry = pluginHelpers.createProxyEntry ? pluginHelpers.createProxyEntry(rule.baseUrl, rule.target, rule.opts) : { [rule.baseUrl]: { target: rule.target } }
        Object.assign(proxyPatch, entry)
      }
      finalDevServer = pluginHelpers.mergeDevServer ? pluginHelpers.mergeDevServer(finalDevServer, { proxy: proxyPatch }) : { ...(finalDevServer || {}), proxy: { ...(finalDevServer.proxy || {}), ...proxyPatch } }
    }
    if (self.options.devServer) {
      finalDevServer = pluginHelpers.mergeDevServer ? pluginHelpers.mergeDevServer(finalDevServer, self.options.devServer) : { ...(finalDevServer || {}), ...(self.options.devServer || {}) }
    }

    return {
      // 合并已有的基础配置
      ...base,

      // 顶层 css/devServer 补丁
      css: mergedCss,
      devServer: finalDevServer,

      /**
       * 直接访问 webpack 配置对象：应用公共别名、公用插件与文件命名策略等
       * 对应实现参考：vue-cli.webpackBaseConfig()
       */
      configureWebpack(config) {
        config.plugins = config.plugins || []
        config.resolve = config.resolve || {}
        config.output = config.output || {}

        // 用户自定义 configureWebpack 扩展（优先执行）
        if (Array.isArray(self.options.configureExtenders)) {
          for (const extender of self.options.configureExtenders) {
            try {
              extender(config)
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('[vue2.builder] configureExtender error:', (e && e.message) || e)
            }
          }
        }

        // 统一执行“configureWebpack”阶段插件（helpers 通过 plugin 中转）
        self.runPlugins('configureWebpack', { config, helpers: pluginHelpers, options: self.options })
      },

      /**
       * 链式方式对 webpack 做精细化调整：
       * - 开发环境可开启 splitChunks
       * - 其余注入（如 CDN）通过插件体系完成
       */
      chainWebpack(config) {
        // 开发模式可选开启分包优化
        if (isDev && self.options.enableSplitChunksInDev) {
          config.optimization.minimize(true)
          config.optimization.splitChunks({ chunks: 'all' })
        }

        // 微前端场景可在此补充特殊处理（按需）
        if (isQiankun) {
          // 例如：runtimePublicPath、library、libraryTarget 等
          // 保持与现有项目兼容，不强制处理
        }

        // 自定义 chain 扩展
        if (Array.isArray(self.options.chainExtenders)) {
          for (const extender of self.options.chainExtenders) {
            try {
              extender(config)
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('[vue2.builder] chainExtender error:', (e && e.message) || e)
            }
          }
        }

        // 统一执行“chainWebpack”阶段插件（helpers 通过 plugin 中转）
        self.runPlugins('chainWebpack', { chain: config, helpers: pluginHelpers, options: self.options })
      },
    }
  }

  /**
   * 读取已标准化的环境配置（供业务侧按需使用）
   * - LM_ENV_CONFIG 的结构来自：build/env/index.ts（聚合 $lm-config/env 下的导出）
   */
  getEnvConfig() {
    return LM_ENV_CONFIG || {}
  }

  /**
   * 返回标准化后的 CDN 资产（css/js 数组，及 externals）
   * - 供外部（或其它构建器）按需使用
   */
  getCdnAssets() {
    return pluginHelpers.normalizeCdnAssets ? pluginHelpers.normalizeCdnAssets(this.options.cdn || {}) : { css: (this.options.cdn && this.options.cdn.css) || [], js: (this.options.cdn && this.options.cdn.js) || [], externals: (this.options.cdn && this.options.cdn.externals) || {} }
  }

  /**
   * 暴露路径工具（只读）
   */
  paths() {
    return {
      appRoot: process.cwd(),
      resolveApp: (...segs) => path.resolve(process.cwd(), ...segs),
      resolveSrcDir: () => path.resolve(process.cwd(), 'src'),
      getPublicPath: (v, fallback = '/') => {
        const ensureSlash = (p, needsSlash) => {
          const has = p.endsWith('/')
          if (has && !needsSlash) return p.slice(0, -1)
          if (!has && needsSlash) return p + '/'
          return p
        }
        const val = v ?? process.env.PUBLIC_PATH ?? fallback
        return ensureSlash(val, true)
      },
    }
  }

  /**
   * 工具：判断当前是否为生产环境
   */
  isProd() {
    return (process.env.APP_ENV || process.env.NODE_ENV) === 'production'
  }

  /**
   * 工具：判断是否为微前端子应用
   */
  isQiankunSlave() {
    return process.env.VUE_APP_IS_QIANKUN === 'true' || process.env.QIANKUN_SLAVE === 'true'
  }
}

module.exports = Vue2CliBuilder
module.exports.default = Vue2CliBuilder
module.exports.Vue2CliBuilder = Vue2CliBuilder
