import baseConfig from './.env.js';
export default {
  ...baseConfig,
  NODE_ENV: "local.qiankun",
  IS_PROD: false,
  IS_QIANKUN: true,
}