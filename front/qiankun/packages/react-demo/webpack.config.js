const path = require('path');
const { buildConfig } = require('@lm/shared');
const WebpackBaseBuilder = buildConfig.WebpackBaseBuilder;

// 加载 .env.* 环境变量（用于代理地址等）
// require('dotenv').config({ path: path.resolve(__dirname, './env/.env.' + process.env.APP_ENV) });
const isDev = process.env.APP_ENV === 'development';

module.exports = () => {
  const builder = new WebpackBaseBuilder({
    define: {},
    plugins: [],
  });

  return builder.createConfig();
};
