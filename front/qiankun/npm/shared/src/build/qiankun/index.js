const { getProjectInfo } = require('../core/scripts/app.js');
const { getEnvConfig } = require('../core/scripts/env.js');

/**
 * QiankunClass 统一封装微应用输出与资源配置
 */
class QiankunClass {
  constructor(options = {}) {
    this.projectName = getProjectInfo().name;
    this.envConfig = getEnvConfig();
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
    const publicPath = process.env.APP_ENV === 'production' ? '' : 'fonts/';
    const fontRule = config.module.rule && config.module.rule('fonts');
    if (!fontRule) return;
    fontRule.uses.clear();
    fontRule
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: '[name].[hash:7].[ext]',
        publicPath,
      });
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