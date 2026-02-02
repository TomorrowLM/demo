import baseConfig from './.env.js';
export default {
  ...baseConfig,
  APP_ENV: "local.qiankun",
  IS_PROD: false,
  IS_QIANKUN: true,
  Build_Path_Qiankun_Assets: `http://localhost:${baseConfig.APP_PORT}`, // 本地微应用资源访问路径
  APP_ROUTER_BASE: "/qiankun/vue2-pc", // 微应用路由根路径
}