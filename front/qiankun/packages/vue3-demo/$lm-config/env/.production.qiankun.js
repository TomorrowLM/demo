import baseConfig from './.env.js';
export default {
  ...baseConfig,
  APP_BASE_API: 'http://0.0.0.0:3600/',
  APP_ENV: "production",
  IS_PROD: true,
  IS_QIANKUN: true,
  APP_OUTPUTDIR: '../dist/qiankun/child/vue3',
  APP_ROUTER_BASE: "/qiankun/vue3", // 微应用路由根路径
  Build_Path: '/qiankun/child/vue3',
}