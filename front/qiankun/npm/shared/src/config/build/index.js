// import * as LM_ENV_CONFIG from "./env/index.js";
// import * as webpackConfig from "./build/webpack/webpack.base.js";
// import * as qiankunConfig from "./build/qiankun/index.js";
// import * as vueConfig from "./build/vue-cli/index.js";
const LM_ENV_CONFIG = require('./env/index.js');
const webpackConfig = require('./webpack/webpack.base.js');
const qiankunConfig = require('./qiankun/index');
const vueConfig = require('./vue-cli/index');

export default {
  buildConfig: {
    webpackConfig,
    vueConfig,
    qiankunConfig,
  },
  LM_ENV_CONFIG,
}