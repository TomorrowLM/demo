/**
 * Webpack 通用辅助方法（可被 Vue/React 等构建器复用）
 * - 严禁出现与具体框架强耦合的逻辑（如 Vue/React 插件）
 * - 仅包含通用的 webpack 配置拼装方法与“安全”插件注入
 */
const path = require("path");
const baseConfig = require("./baseConfig");
const { getEnvConfig } = require("./scripts/env.js");
const { alias, devServer } = baseConfig;
const { getProjectInfo } = require("./scripts/app.js");
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
 * 深合并（对象/数组），尽量无副作用
 * - 仅实现构建配置场景够用的能力，避免引入第三方依赖
 */
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function deepMerge(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  }
  if (isPlainObject(target) && isPlainObject(source)) {
    const out = { ...target };
    Object.keys(source).forEach((k) => {
      const tv = out[k];
      const sv = source[k];
      if (Array.isArray(tv) && Array.isArray(sv)) {
        out[k] = [...tv, ...sv];
      } else if (isPlainObject(tv) && isPlainObject(sv)) {
        out[k] = deepMerge(tv, sv);
      } else {
        out[k] = sv;
      }
    });
    return out;
  }
  return source !== undefined ? source : target;
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
  const env = getEnvConfig(process.env.NODE_ENV);
  const appInfo = getProjectInfo();
  return { ...env, ...appInfo };
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
function mergeExternals(config, externals = {}) {
  config.externals = {
    ...(config.externals || {}),
    ...(externals || {}),
  };
}

/**
 * 生成 devServer.proxy 条目
 * - baseUrl: 业务侧请求前缀（如 /api）
 * - apiHost: 目标代理地址
 */
function createProxyEntry() {
  return devServer;
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
  deepMerge,
  applyFilenameHashing,
  fetchAlias,
  fetchDefinePlugin,
  addProvidePlugin,
  mergeExternals,
  createProxyEntry,
  normalizeCdnAssets,
};
