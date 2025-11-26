/**
 * Vue2（Vue CLI）项目构建入口
 * - 使用共享封装的 Vue2CliBuilder，统一多项目构建能力
 * - 可按需配置 externals、开发阶段分包优化等
 */
const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
const Vue2CliBuilder = require('@lm/shared/build').__require().buildConfig.Vue2CliBuilder;
console.log('Vue2CliBuilder', Vue2CliBuilder);
if (!Vue2CliBuilder) {
  throw new Error('[vue.config] cannot resolve Vue2CliBuilder from @lm/shared/build — please rebuild shared (npm run build:rollup) and ensure package is linked.');
}
const commonPlugin = [
  // 扩展环境变量
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment/,
  }),
  // 自动加载模块，而不必到处 import 或 require ，在这里加载模块之后，组件内部就不用inport引入了
  new webpack.ProvidePlugin({
    $_: 'lodash',
    moment: 'moment',
  }),
  new webpack.DefinePlugin({
    pageSize: 15,
  }),
];
// 构建器实例：可根据项目需要调整参数
const builder = new Vue2CliBuilder({
  // 自定义外部依赖（示例：地图 SDK）
  externals: {
    BMap: 'window.BMap',
    AMap: 'AMap'
  },
  // 开发环境是否开启分包优化（即使在开发也做 splitChunks）
  enableSplitChunksInDev: true,
  plugins: [...commonPlugin],
  // 添加 chainWebpack 配置以确保正确处理 TypeScript 文件
  chainExtenders: [
    config => {
      // 确保正确处理 .ts 文件
      config.module
        .rule('ts')
        .test(/\.ts$/)
        .use('ts-loader')
        .loader('ts-loader')
        .options({
          transpileOnly: true,
          appendTsSuffixTo: [/\.vue$/]
        })
        .end()
    }
  ]
  // 进阶用法（可选）：
  // chainExtenders: [config => { /* 在 chainWebpack 中追加自定义规则 */ }],
  // configureExtenders: [config => { /* 在 configureWebpack 中修改配置 */ }]
})
console.log('builder.createConfig()', builder.createConfig())
// 导出 Vue CLI 配置
module.exports = defineConfig(builder.createConfig())