import baseConfig from "./.env.js";

export default {
  ...baseConfig,
  NODE_ENV: "production",
  IS_PROD: true,
  IS_QIANKUN: false,
};
