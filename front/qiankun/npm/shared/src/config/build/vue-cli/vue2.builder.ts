/**
 * Vue CLI 下的 Vue2 构建类（轻封装）
 * 目标：
 * 1. 基于现有 vue-cli 配置能力做最小封装，便于多项目快速接入
 * 2. 公共方法、常量放在 core 下（如：paths/merge/constants 等），本文件只做适配与拼装
 * 3. 环境变量来源：@/npm/shared/src/config/build/env/index.ts（会从每个项目 $lm-config/env 目录读取）
 *
 * 用法（在各项目的 vue.config.js 中）：
 *   const { defineConfig } = require('@vue/cli-service')
 *   const Vue2CliBuilder = require('@lm/shared/config/build/vue-cli/vue2.builder').default
 *   const builder = new Vue2CliBuilder({ isMobile: false })
 *   module.exports = defineConfig(builder.createConfig())
 */

const path = require('path')

// 引入 core 工具（可按需增加）
// 提醒：core 下仅放与具体构建器无关的纯工具/常量，避免耦合
// const { createOutputDefaults } = require('../core/constants') // 如需可启用
// const { deepMerge } = require('../core/merge') // 如需可启用
const paths = require('../core/paths')

// 引入当前目录下现有的 vue-cli 配置函数
// 这些函数来自文件：@/npm/shared/src/config/build/vue-cli/index.ts
// 包含：commonPlugin, aliasConfigFn, webpackBaseConfig, baseConfig, cssConfig
const vueCli = require('./index')

// 统一环境对象（从每个项目 $lm-config/env 下读取配置，已经由 build/env/index.ts 处理）
const LM_ENV_CONFIG = require('../env')

/**
 * 构建器可选项
 */
interface Vue2CliBuilderOptions {
  // 是否移动端（影响 css pxtorem 等扩展能力；当前示例不强制使用）
  isMobile?: boolean
  // 需要直接注入的 externals（例如地图 SDK）
  externals?: Record<string, any>
  // 是否启用代码分割优化（开发时也可开启）
  enableSplitChunksInDev?: boolean
  // 额外自定义的 chainWebpack 回调（按需拼接）
  chainExtenders?: Array<(config: any) => void>
  // 额外自定义的 configureWebpack 回调（按需拼接）
  configureExtenders?: Array<(config: any) => void>
}

/**
 * Vue CLI Vue2 构建类
 */
class Vue2CliBuilder {
  private options: Vue2CliBuilderOptions

  constructor(options: Vue2CliBuilderOptions = {}) {
    this.options = options
  }

  /**
   * 生成可直接作为 vue.config.js 导出的配置对象
   * - 复用已有 baseConfig/process 逻辑，保持与历史项目一致
   * - 在 configureWebpack 中套用 webpackBaseConfig（别名、Define/Provide、文件名规则等）
   * - 在 chainWebpack 中按需追加优化
   */
  public createConfig() {
    // 基础配置：publicPath/outputDir/sourceMap/devServer/css ...
    // 对应实现参考：[@vue-cli.baseConfig()](npm/shared/src/config/build/vue-cli/index.ts:202)
    const base = vueCli.baseConfig(process.env)

    const isDev = (process.env.APP_ENV || process.env.NODE_ENV) !== 'production'
    const isQiankun = process.env.VUE_APP_IS_QIANKUN === 'true'

    const self = this

    return {
      // 合并已有的基础配置
      ...base,

      /**
       * configureWebpack：直接访问 webpack 配置对象
       * 在这里应用公共别名、公用插件与文件命名策略等
       * 对应实现参考：[@vue-cli.webpackBaseConfig()](npm/shared/src/config/build/vue-cli/index.ts:174)
       */
      configureWebpack(config: any) {
        // 兜底
        config.plugins = config.plugins || []
        config.resolve = config.resolve || {}
        config.output = config.output || {}

        // 应用基础 webpack 配置（含 Provide/Define、alias、文件名 hash 策略等）
        vueCli.webpackBaseConfig(process.env, config, (p: string) => path.resolve(process.cwd(), p))

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
              // 保守失败：不中断构建
              console.warn('[vue2.builder] configureExtender error:', e?.message || e)
            }
          }
        }
      },

      /**
       * chainWebpack：以链式方式对 webpack 做精细化调整
       * 这里示例保持开发环境也可做 splitChunks，按需开启
       */
      chainWebpack(config: any) {
        // 开发模式下可选开启分包优化
        if (isDev && self.options.enableSplitChunksInDev) {
          config.optimization.minimize(true)
          config.optimization.splitChunks({
            chunks: 'all',
          })
        }

        // 微前端场景可在此补充特殊处理（占位，按需启用）
        if (isQiankun) {
          // 如需：配置 runtimePublicPath、library、libraryTarget 等
          // 此处不强制处理，保持与现有项目兼容
        }

        // 追加用户自定义 chainWebpack 扩展
        if (Array.isArray(self.options.chainExtenders)) {
          for (const extender of self.options.chainExtenders) {
            try {
              extender(config)
            } catch (e) {
              console.warn('[vue2.builder] chainExtender error:', e?.message || e)
            }
          }
        }
      },

      /**
       * 可按需暴露 runtimeCompiler、transpileDependencies 等 vue-cli 选项
       * 这里默认保持与 baseConfig 一致，不再重复设置
       */
    }
  }

  /**
   * 读取已标准化的环境配置（供业务侧按需使用）
   * - LM_ENV_CONFIG 的结构来自：build/env/index.ts（聚合 $lm-config/env 下的导出）
   */
  public getEnvConfig() {
    return LM_ENV_CONFIG || {}
  }

  /**
   * 暴露路径工具（只读）
   */
  public paths() {
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
  public isProd() {
    return (process.env.APP_ENV || process.env.NODE_ENV) === 'production'
  }

  /**
   * 工具：判断是否为微前端子应用
   */
  public isQiankunSlave() {
    return process.env.VUE_APP_IS_QIANKUN === 'true' || process.env.QIANKUN_SLAVE === 'true'
  }
}

export default Vue2CliBuilder
module.exports = Vue2CliBuilder