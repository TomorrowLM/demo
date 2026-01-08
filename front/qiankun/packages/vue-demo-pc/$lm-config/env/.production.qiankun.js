import baseConfig from './.env.js';
export default {
  ...baseConfig,
  APP_BASE_API: 'http://0.0.0.0:3600/',
  NODE_ENV: "production",
  IS_PROD: true,
  IS_QIANKUN: false,
  APP_OUTPUTDIR: '../dist/qiankun/child/vue2-pc',
  Build_Path: '/qiankun/child/vue2-pc/',
}