/**
 * Vue2（Vue CLI）插件适配层（CommonJS 版本）
 * 作用：把 core/webpack.helpers.js 中的“通用能力”转换为 Vue2 可用的插件函数（供构建器的插件体系调用）
 *
 * 设计要点
 * - 本文件仅作为“中转站”，避免构建器直接依赖 core，统一从这里拿到 helpers 与插件工厂
 * - 插件函数均返回一个可被构建器 use() 注册的回调，接收通用上下文 ctx
 *   ctx: { stage: 'configureWebpack' | 'chainWebpack', config?, chain?, helpers, options }
 */

// 引入通用工具（core）
const helpers = require('../core/core.helpers.js');

/**
 * externals 插件（适配 Vue2 configureWebpack 阶段）
 * - 将 map 合并进 webpack.externals
 */
function externalsPlugin(map = {}) {
  return function plugin(ctx) {
    if (ctx.stage === 'configureWebpack' && ctx.config) {
      ctx.helpers.mergeExternals(ctx.config, map || {});
    }
  };
}

/**
 * alias 插件（适配 Vue2 configureWebpack 阶段）
 * - 将 alias 合并进 webpack.resolve.alias
 */
/**
 * 别名插件函数，用于配置Webpack的路径别名
 * @param {Object} config - Webpack配置对象
 * @param {Object} [alias={}] - 路径别名配置对象，默认为空对象
 */
function aliasPlugin() {
  return helpers.fetchAlias()
}

/**
 * define 插件（适配 Vue2 configureWebpack 阶段）
 * - 追加 DefinePlugin 定义
 */
function definePlugin(defines = {}) {
  return function plugin(ctx) {
    if (ctx.stage === 'configureWebpack' && ctx.config) {
      ctx.helpers.addDefinePlugin(ctx.config, defines || {});
    }
  };
}

/**
 * provide 插件（适配 Vue2 configureWebpack 阶段）
 * - 追加 ProvidePlugin 定义
 */
function providePlugin(provides = {}) {
  
}

/**
 * html CDN 注入插件（适配 Vue2 chainWebpack 阶段）
 * - 将 css/js 外链注入到 html-webpack-plugin 模板参数的 cdn 字段
 * - 模板中可通过 htmlWebpackPlugin.options.cdn 遍历注入
 */
function htmlCdnPlugin(cdn = {}) {
  return function plugin(ctx) {
    if (ctx.stage !== 'chainWebpack' || !ctx.chain) return;
    const norm = ctx.helpers.normalizeCdnAssets({
      css: Array.isArray(cdn.css) ? cdn.css : [],
      js: Array.isArray(cdn.js) ? cdn.js : [],
      externals: {}, // 此处只负责注入外链，不处理 externals
    });
    try {
      ctx.chain.plugin('html').tap((args) => {
        const a0 = args[0] || {};
        a0.cdn = a0.cdn || {};
        a0.cdn.css = Array.isArray(a0.cdn.css) ? a0.cdn.css : [];
        a0.cdn.js = Array.isArray(a0.cdn.js) ? a0.cdn.js : [];
        a0.cdn.css.push(...(norm.css || []));
        a0.cdn.js.push(...(norm.js || []));
        args[0] = a0;
        return args;
      });
    } catch (e) {
      // 如果 html-webpack-plugin 不存在，跳过即可
      // eslint-disable-next-line no-console
      console.warn('[vue2.plugin] html cdn inject skipped:', (e && e.message) || e);
    }
  };
}

/**
 * devServer 代理插件（可选）
 * - 通过 helpers.createProxyEntry 合并代理
 * - 注意：此能力更适合在顶层 vue.config.js 的 devServer 字段处理，本插件仅做示例
 */
function devServerProxyPlugin(name) {
  return helpers.createProxyEntry()[name]
}

module.exports = {
  externalsPlugin,
  aliasPlugin,
  definePlugin,
  providePlugin,
  htmlCdnPlugin,
  devServerProxyPlugin,
  // 同时暴露 helpers，方便在构建器内部透传
  helpers,
};
