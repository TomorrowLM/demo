/**
 * Vue2（Vue CLI）插件适配层
 * 作用：把 core/webpack.helpers.js 中的“通用能力”转换为 Vue2 可用的插件函数（供构建器的插件体系调用）
 *
 * 设计要点
 * - 本文件只做“适配转换”，避免直接耦合业务或具体工程
 * - 插件函数均返回一个可被构建器 use() 注册的回调，接收通用上下文 ctx
 *   ctx: { stage: 'configureWebpack' | 'chainWebpack', config?, chain?, helpers, options }
 * - 通用方法来自 core/webpack.helpers.js（如 mergeExternals/mergeAliases/addDefinePlugin/...）
 */

type Stage = 'configureWebpack' | 'chainWebpack';
interface PluginCtx {
  stage: Stage;
  config?: any;        // 供 configureWebpack 阶段使用的 webpack config 对象
  chain?: any;         // 供 chainWebpack 阶段使用的 chain 实例
  helpers: any;        // core/webpack.helpers.js 导出的工具集合
  options: any;        // 构建器的 options
}

// 以 require 方式引入通用工具，保证在 Node 环境可直接执行
// eslint-disable-next-line @typescript-eslint/no-var-requires
const helpers = require('../core/webpack.helpers.js');

/**
 * externals 插件（适配 Vue2 configureWebpack 阶段）
 * - 将 map 合并进 webpack.externals
 */
export function externalsPlugin(map: Record<string, any> = {}) {
  return function plugin(ctx: PluginCtx) {
    if (ctx.stage === 'configureWebpack' && ctx.config) {
      ctx.helpers.mergeExternals(ctx.config, map || {});
    }
  };
}

/**
 * alias 插件（适配 Vue2 configureWebpack 阶段）
 * - 将 alias 合并进 webpack.resolve.alias
 */
export function aliasPlugin(alias: Record<string, string> = {}) {
  return function plugin(ctx: PluginCtx) {
    if (ctx.stage === 'configureWebpack' && ctx.config) {
      ctx.helpers.mergeAliases(ctx.config, alias || {});
    }
  };
}

/**
 * define 插件（适配 Vue2 configureWebpack 阶段）
 * - 追加 DefinePlugin 定义
 */
export function definePlugin(defines: Record<string, any> = {}) {
  return function plugin(ctx: PluginCtx) {
    if (ctx.stage === 'configureWebpack' && ctx.config) {
      ctx.helpers.addDefinePlugin(ctx.config, defines || {});
    }
  };
}

/**
 * provide 插件（适配 Vue2 configureWebpack 阶段）
 * - 追加 ProvidePlugin 定义
 */
export function providePlugin(provides: Record<string, any> = {}) {
  return function plugin(ctx: PluginCtx) {
    if (ctx.stage === 'configureWebpack' && ctx.config) {
      ctx.helpers.addProvidePlugin(ctx.config, provides || {});
    }
  };
}

/**
 * html CDN 注入插件（适配 Vue2 chainWebpack 阶段）
 * - 将 css/js 外链注入到 html-webpack-plugin 模板参数的 cdn 字段
 * - 模板中可通过 htmlWebpackPlugin.options.cdn 遍历注入
 */
export function htmlCdnPlugin(cdn: { css?: string[]; js?: string[] } = {}) {
  return function plugin(ctx: PluginCtx) {
    if (ctx.stage !== 'chainWebpack' || !ctx.chain) return;
    const norm = ctx.helpers.normalizeCdnAssets({
      css: Array.isArray(cdn.css) ? cdn.css : [],
      js: Array.isArray(cdn.js) ? cdn.js : [],
      externals: {}, // 此处只负责注入外链，不处理 externals
    });
    try {
      ctx.chain.plugin('html').tap((args: any[]) => {
        const a0 = args[0] || {};
        a0.cdn = a0.cdn || {};
        a0.cdn.css = Array.isArray(a0.cdn.css) ? a0.cdn.css : [];
        a0.cdn.js = Array.isArray(a0.cdn.js) ? a0.cdn.js : [];
        a0.cdn.css.push(...(norm.css || []));
        a0.cdn.js.push(...(norm.js || []));
        args[0] = a0;
        return args;
      });
    } catch (e: any) {
      // 如果 html-webpack-plugin 不存在，跳过即可
      // eslint-disable-next-line no-console
      console.warn('[vue2.plugin] html cdn inject skipped:', (e && e.message) || e);
    }
  };
}

/**
 * devServer 代理插件（可选）
 * - 通过 helpers.createProxyEntry/createDevServer 合并代理
 * - 注意：此能力更适合在顶层 vue.config.js 的 devServer 字段处理，本插件仅做示例
 */
export function devServerProxyPlugin(rules: Array<{ baseUrl: string; target: string; opts?: any }> = []) {
  return function plugin(ctx: PluginCtx) {
    if (ctx.stage !== 'configureWebpack' || !ctx.config) return;
    if (!Array.isArray(rules) || !rules.length) return;
    const patch: any = {};
    for (const rule of rules) {
      if (!rule || !rule.baseUrl || !rule.target) continue;
      Object.assign(patch, helpers.createProxyEntry(rule.baseUrl, rule.target, rule.opts));
    }
    // 将结果挂到 config.devServer，最终由 CLI 合并（不同版本 CLI 对 devServer 的合并策略不同）
    ctx.config.devServer = ctx.config.devServer || {};
    ctx.config.devServer.proxy = {
      ...(ctx.config.devServer.proxy || {}),
      ...patch,
    };
  };
}

export default {
  externalsPlugin,
  aliasPlugin,
  definePlugin,
  providePlugin,
  htmlCdnPlugin,
  devServerProxyPlugin,
  // 同时暴露 helpers，方便在构建器内部透传
  helpers,
};