import baseConfig from "./.env.js";

export default {
  ...baseConfig,
  APP_ENV: "development",
  IS_PROD: false,
  IS_QIANKUN: false,
  Build_Path: "/",
  APP_ROUTER_BASE: "/qiankun",
};
