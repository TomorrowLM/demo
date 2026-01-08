const { getProjectInfo } = require('../core/scripts/app.js');
const { getEnvConfig } = require('../core/scripts/env.js');

/**
 * QiankunClass 统一封装微应用输出与资源配置
 */
class QiankunClass {
  constructor(options = {}) {
    this.projectName = getProjectInfo().name;
    this.envConfig = getEnvConfig(process.env.NODE_ENV);
  }

  /**
   * 应用 webpack output 配置（供 CLI configureWebpack 使用）
   */
  applyOutputConfig(config, overrideName) {
    if (!config || !config.output) return;
    const name = overrideName || this.projectName;
    const outputOptions = this.getOutputConfig(name);
    Object.assign(config.output, outputOptions);
  }

  /**
   * 配置字体等静态资源的 publicPath
   */
  configureAssets(config) {
    if (!config || !config.module) return;
    const { IS_PROD, Build_Path, Build_Path_Qiankun_Assets } = this.envConfig || {};
    console.log('[shared]configureAssets IS_QIANKUN:', this.envConfig, Build_Path_Qiankun_Assets);
    // 基础前缀：
    // - 微应用生产环境：使用 Build_Path（如 /qiankun/child/vue2-pc/）
    // - 其他场景：使用 Build_Path（如 /vue2-pc/），没有则退回根路径
    const base = (IS_PROD ? Build_Path : Build_Path_Qiankun_Assets) || '/';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    const publicPath = `${normalizedBase}fonts/`;
    const fontRule = config.module.rule && config.module.rule('fonts');
    console.log('[shared]configureAssets fontRule:', fontRule);
    if (!fontRule) return;
    // 使用 file-loader 输出实际文件，避免 asset/url-loader 将小文件内联为 base64
    fontRule.uses.clear();
    // 覆盖掉 vue-cli 默认的 type: 'asset' 配置，恢复为使用 loader 的模式
    // fontRule.use('url-loader').loader('url-loader').options({}).end();
    fontRule.type('asset/inline').set('generator', {}); //匹配到的字体文件不会再走 file-loader，而是被 内联成 base64 的 data URL 写进打包后的 CSS/JS 里
    // fontRule.type('javascript/auto');
    // fontRule
    //   .use('file-loader')
    //   .loader('file-loader')
    //   .options({
    //     name: '[name].[hash:7].[ext]',
    //     publicPath,
    //   });
  }

  /**
   * 获取 qiankun 兼容的输出配置
   */
  setOutputConfig(config) {
    const name = this.projectName;
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = "umd"; // 把微应用打包成 umd 库格式
    config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;// webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    if (this.envConfig.IS_PROD) {
      config.output.filename = `js/[name].[contenthash].js`;
      config.output.chunkFilename = `js/[name].[contenthash].js`;
    }
    return config;
  }
}

module.exports = QiankunClass;
module.exports.QiankunClass = QiankunClass;