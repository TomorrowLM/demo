import baseConfig from "./.env.js";

export default {
  ...baseConfig,
  NODE_ENV: "development",
  IS_PROD: false,
  IS_QIANKUN: false,
};
