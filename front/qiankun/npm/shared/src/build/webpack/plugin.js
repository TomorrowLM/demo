// 引入通用工具（core）
const helpers = require("../core/core.helpers.js");

/**
 * define 插件（适配 Vue2 configureWebpack 阶段）
 * - 追加 DefinePlugin 定义
 */
function definePlugin() {
  const defines = helpers.fetchDefinePlugin();
  const webpack = require("webpack");
  return new webpack.DefinePlugin({
    GLOBAL_INFO: JSON.stringify(defines),
  });
}

module.exports = {
  definePlugin,
};
