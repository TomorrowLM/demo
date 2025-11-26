/**
 * @lm/shared/config 入口聚合（CommonJS）
 * - 暴露 buildConfig 与 LM_ENV_CONFIG
 * - 增加 Vue2CliBuilder 与通用 webpackHelpers，供 React/Webpack 构建复用
 * - 保持与历史导出兼容，并提供 default 导出
 */
// 兼容不同打包输出形态：有些构建器在打包后会导出一个懒加载的 __require 函数
// 我们在这里优先尝试执行 __require()（如果存在），否则使用模块的 default 或直接导出值
const builderMod = require('./vue-cli/index.builder.js');
let Vue2CliBuilder = null;
if (builderMod) {
  if (typeof builderMod.__require === 'function') {
    try {
      Vue2CliBuilder = builderMod.__require();
    } catch (e) {
      // 如果 __require 调用失败，继续后续回退
      Vue2CliBuilder = null;
    }
  }
  if (!Vue2CliBuilder) Vue2CliBuilder = builderMod.default || builderMod;
}

// CommonJS 导出
module.exports = {
  /**
   * 构建相关导出
   */
  buildConfig: {
    Vue2CliBuilder: Vue2CliBuilder,  // Vue CLI 下的 Vue2 构建类（兼容懒加载产物）
  },
};
