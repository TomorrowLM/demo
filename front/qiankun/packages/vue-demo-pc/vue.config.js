/**
 * Vue2（Vue CLI）项目构建入口
 * - 使用共享封装的 Vue2CliBuilder，统一多项目构建能力
 * - 可按需配置 externals、开发阶段分包优化等
 */
const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
const Vue2CliBuilder = require('@lm/shared').buildConfig.Vue2CliBuilder;
if (!Vue2CliBuilder) {
  throw new Error('[vue.config] cannot resolve Vue2CliBuilder from @lm/shared/build — please rebuild shared (npm run build:rollup) and ensure package is linked.');
}
const commonPlugin = [
  // 扩展环境变量
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment/,
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
  plugins: [...commonPlugin],
})
// console.log('builder.createConfig()', builder.createConfig())
module.exports = defineConfig(builder.createConfig())