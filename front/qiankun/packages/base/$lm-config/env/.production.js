import baseConfig from "./.env.js";

export default {
  ...baseConfig,
  IS_PROD: true,
  IS_QIANKUN: false,
  APP_ENV: "production",
  APP_OUTPUTDIR: "../dist/qiankun",
  APP_ROUTER_BASE: "/qiankun/",
  Build_Path: "/qiankun/",
};
