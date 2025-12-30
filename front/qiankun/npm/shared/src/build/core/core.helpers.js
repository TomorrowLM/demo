/**
 * Webpack 通用辅助方法（可被 Vue/React 等构建器复用）
 * - 严禁出现与具体框架强耦合的逻辑（如 Vue/React 插件）
 * - 仅包含通用的 webpack 配置拼装方法与“安全”插件注入
 */
const path = require("path");
const baseConfig = require("./baseConfig");
const { alias, devServer, provideDefines } = baseConfig;

// 安全 require（CI/打包流程等环境下不抛错）
function safeRequire(name) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(name);
  } catch (e) {
    return null;
  }
}

/**
 * 应用文件名 hash 策略
 * - isProd = true 使用 contenthash
 * - isProd = false 使用 hash
 */
function applyFilenameHashing(config, isProd) {
  config.output = config.output || {};
  if (isProd) {
    config.output.filename = "js/[name].[contenthash].js";
    config.output.chunkFilename = "js/[name].[contenthash].js";
  } else {
    config.output.filename = "js/[name].[hash].js";
    config.output.chunkFilename = "js/[name].[hash].js";
  }
}

/**
 * 合并别名
 */
function fetchAlias(mergeAlias) {
  return alias;
}

/**
 * 注入 DefinePlugin（安全）
 * - 统一从 $lm-config/env 读取环境，并注入：
 *   - GLOBAL_INFO: 整个环境对象
 *   - APP_${key}: 每个环境字段对应的常量
 * - 业务侧可通过 defineObj 追加/覆盖字段
 */
function fetchDefinePlugin(config, defineObj = {}) {
  const webpack = safeRequire("webpack");
  console.log('provideDefines', provideDefines());
  return new webpack.DefinePlugin(provideDefines());
}

/**
 * 注入 ProvidePlugin（安全）
 */
function addProvidePlugin(config, provideObj = {}) {
  const webpack = safeRequire("webpack");
  if (!webpack || !provideObj || !Object.keys(provideObj).length) return;
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.ProvidePlugin(provideObj));
}

/**
 * 合并 externals
 */
function addExternals(config, externals = {}) {
  config.externals = Object.assign({}, config.externals || {}, externals || {});
}

/**
 * 生成 devServer.proxy 条目
 * - baseUrl: 业务侧请求前缀（如 /api）
 * - apiHost: 目标代理地址
 */
function fetchProxyEntry(GLOBAL_INFO) {
  console.log('devServer', devServer(GLOBAL_INFO));
  return devServer(GLOBAL_INFO) || {};
}

/**
 * 从 assetsCDN 结构中拿到可注入到 HTML 的链接（纯数据，不做注入动作）
 * - 交由调用方在 HtmlWebpackPlugin 或模板中自行注入
 */
function normalizeCdnAssets(assetsCDN = {}) {
  const css = Array.isArray(assetsCDN.css) ? assetsCDN.css : [];
  const js = Array.isArray(assetsCDN.js) ? assetsCDN.js : [];
  const externals = isPlainObject(assetsCDN.externals)
    ? assetsCDN.externals
    : {};
  return { css, js, externals };
}

module.exports = {
  safeRequire,
  applyFilenameHashing,
  fetchAlias,
  fetchDefinePlugin,
  fetchProxyEntry,
  addProvidePlugin,
  addExternals,
  normalizeCdnAssets,
};
