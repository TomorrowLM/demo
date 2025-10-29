import baseConfig from './.env.js';
export default {
  ...baseConfig,
  IS_QIANKUN: true,
  NODE_ENV: "local.qiankun"
}