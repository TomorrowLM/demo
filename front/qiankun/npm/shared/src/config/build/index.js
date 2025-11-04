/**
 * @lm/shared/config 入口聚合（CommonJS）
 * - 暴露 buildConfig 与 LM_ENV_CONFIG
 * - 增加 Vue2CliBuilder 与通用 webpackHelpers，供 React/Webpack 构建复用
 * - 保持与历史导出兼容，并提供 default 导出
 */
const Vue2CliBuilder = require('./vue-cli/index.builder.js');

// CommonJS 导出
module.exports = {
  /**
   * 构建相关导出
   */
  buildConfig: {
    Vue2CliBuilder,  // 新增：Vue CLI 下的 Vue2 构建类
  },
};
