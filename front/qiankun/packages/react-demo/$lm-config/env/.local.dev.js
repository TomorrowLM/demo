import baseConfig from './.env.js';
export default {
  ...baseConfig,
  APP_BASE_API: 'http://0.0.0.0:3600/',
  APP_ENV: "local.dev",
  IS_PROD: false,
  IS_QIANKUN: false,
  APP_ROUTER_BASE: "/react-app", // 微应用路由根路径
}