import baseConfig from './.env.js';
export default {
  ...baseConfig,
  APP_BASE_API: 'http://0.0.0.0:3600/',
  APP_ENV: "production",
  IS_PROD: true,
  IS_QIANKUN: false,
  APP_OUTPUTDIR: './',
  Build_Path: '/vue2-pc/',
}