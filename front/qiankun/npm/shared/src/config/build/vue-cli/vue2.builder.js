/**
 * Vue CLI 下的 Vue2 构建类（CommonJS 版本）
 * 目标：
 * 1. 基于现有 vue-cli 配置能力做最小封装，便于多项目快速接入
 * 2. 公共方法、常量放在 core 下（如：paths/merge/constants 等），本文件只做适配与拼装
 * 3. 环境变量来源：@/npm/shared/src/config/build/env/index.ts（会从每个项目 $lm-config/env 目录读取）
 *
 * 用法（在各项目的 vue.config.js 中）：
 *   const { defineConfig } = require('@vue/cli-service')
 *   const { Vue2CliBuilder } = require('@lm/shared/config').buildConfig
 *   const builder = new Vue2CliBuilder({ isMobile: false })
 *   module.exports = defineConfig(builder.createConfig())
 */

const path = require('path')

// 引入 core 工具（保持无构建器耦合）
let paths
try {
  paths = require('../core/paths')
} catch (e) {
  // 兜底：路径工具缺失不影响构建核心逻辑
  paths = {
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
    }
  }
}

// 引入当前目录下现有的 vue-cli 配置函数
// 文件：@/npm/shared/src/config/build/vue-cli/index.ts
// 导出：commonPlugin, aliasConfigFn, webpackBaseConfig, baseConfig, cssConfig
const vueCli = require('./index')

// 统一环境对象（从每个项目 $lm-config/env 下读取配置，已经由 build/env/index.ts 处理）
const LM_ENV_CONFIG = require('../env')

/**
 * 构建器可选项
 * @typedef {Object} Vue2CliBuilderOptions
 * @property {boolean} [isMobile] 是否移动端（影响 css 扩展能力；当前示例不强制使用）
 * @property {Record<string, any>} [externals] 需要直接注入的 externals（例如地图 SDK）
 * @property {boolean} [enableSplitChunksInDev] 开发环境是否开启代码分割
 * @property {Array<Function>} [chainExtenders] 额外 chainWebpack 扩展
 * @property {Array<Function>} [configureExtenders] 额外 configureWebpack 扩展
 */

/**
 * Vue CLI Vue2 构建类
 */
class Vue2CliBuilder {
  /**
   * @param {Vue2CliBuilderOptions} options
   */
  constructor(options = {}) {
    this.options = options
  }

  /**
   * 生成可直接作为 vue.config.js 导出的配置对象
   * - 复用已有 baseConfig 逻辑，保持与历史项目一致
   * - 在 configureWebpack 中套用 webpackBaseConfig（别名、Define/Provide、文件名规则等）
   * - 在 chainWebpack 中按需追加优化
   */
  createConfig() {
    // 基础配置：publicPath/outputDir/sourceMap/devServer/css ...
    // 对应实现参考：vue-cli.baseConfig()
    const base = vueCli.baseConfig(process.env)

    const isDev = (process.env.APP_ENV || process.env.NODE_ENV) !== 'production'
    const isQiankun = process.env.VUE_APP_IS_QIANKUN === 'true'
    const self = this

    return {
      // 合并已有的基础配置
      ...base,

      /**
       * 直接访问 webpack 配置对象：应用公共别名、公用插件与文件命名策略等
       * 对应实现参考：vue-cli.webpackBaseConfig()
       */
      configureWebpack(config) {
        config.plugins = config.plugins || []
        config.resolve = config.resolve || {}
        config.output = config.output || {}

        // 应用基础 webpack 配置（含 Provide/Define、alias、文件名 hash 策略等）
        vueCli.webpackBaseConfig(process.env, config, (p) => path.resolve(process.cwd(), p))

        // 项目自定义 externals（例如地图 SDK）
        if (self.options.externals) {
          config.externals = {
            ...(config.externals || {}),
            ...self.options.externals,
          }
        }

        // 追加用户自定义 configureWebpack 扩展
        if (Array.isArray(self.options.configureExtenders)) {
          for (const extender of self.options.configureExtenders) {
            try {
              extender(config)
            } catch (e) {
              console.warn('[vue2.builder] configureExtender error:', e && e.message || e)
            }
          }
        }
      },

      /**
       * 链式方式对 webpack 做精细化调整
       * - 示例：开发环境也可开启 splitChunks
       */
      chainWebpack(config) {
        if (isDev && self.options.enableSplitChunksInDev) {
          config.optimization.minimize(true)
          config.optimization.splitChunks({
            chunks: 'all',
          })
        }

        if (isQiankun) {
          // 微前端场景可在此补充特殊处理（占位，按需启用）
          // 例如：runtimePublicPath、library、libraryTarget 等
        }

        // 追加用户自定义 chainWebpack 扩展
        if (Array.isArray(self.options.chainExtenders)) {
          for (const extender of self.options.chainExtenders) {
            try {
              extender(config)
            } catch (e) {
              console.warn('[vue2.builder] chainExtender error:', e && e.message || e)
            }
          }
        }
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
   * 暴露路径工具（只读）
   */
  paths() {
    return {
      appRoot: paths.appRoot,
      resolveApp: paths.resolveApp,
      resolveSrcDir: paths.resolveSrcDir,
      getPublicPath: paths.getPublicPath,
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