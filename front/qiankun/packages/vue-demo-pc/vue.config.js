/**
 * Vue2（Vue CLI）项目构建入口
 * - 使用共享封装的 Vue2CliBuilder，统一多项目构建能力
 * - 可按需配置 externals、开发阶段分包优化等
 */
const { defineConfig } = require('@vue/cli-service')
console.log('vue.config.js', require('@lm/shared/build')['__require']())
// 说明：此路径依赖 @lm/shared/config 包的解析规则，若不生效可替换为相对路径
const Vue2CliBuilder = require('@lm/shared/build')['__require']().buildConfig.Vue2CliBuilder

// 构建器实例：可根据项目需要调整参数
const builder = new Vue2CliBuilder({
  // 自定义外部依赖（示例：地图 SDK）
  externals: {
    BMap: 'window.BMap',
    AMap: 'AMap'
  },
  // 开发环境是否开启分包优化（即使在开发也做 splitChunks）
  enableSplitChunksInDev: true
  // 进阶用法（可选）：
  // chainExtenders: [config => { /* 在 chainWebpack 中追加自定义规则 */ }],
  // configureExtenders: [config => { /* 在 configureWebpack 中修改配置 */ }]
})

// 导出 Vue CLI 配置
module.exports = defineConfig(builder.createConfig())
