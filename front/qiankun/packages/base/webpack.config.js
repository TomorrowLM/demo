const path = require('path');
const { buildConfig } = require('@lm/shared');
const WebpackBaseBuilder = buildConfig.WebpackBaseBuilder;

// 加载 .env.* 环境变量（用于代理地址等）
// require('dotenv').config({ path: path.resolve(__dirname, './env/.env.' + process.env.NODE_ENV) });
// const isDev = process.env.NODE_ENV === 'development';

module.exports = () => {
  const builder = new WebpackBaseBuilder({
    // 入口 / 输出 / publicPath 与原配置保持一致
    // entry: path.resolve(__dirname, './src/main.tsx'),
    // outputPath: path.resolve(__dirname, '../dist/qiankun'),
    // publicPath: isDev ? '/' : '/qiankun',
    // 开发服务器配置保持不变
    // devServer: {
    //   historyApiFallback: true,
    //   open: true,
    //   port: 3500,
    //   static: './public',
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   },
    //   proxy: [
    //     {
    //       context: ['/vue2-mobile/api', '/vue2-pc/api', '/vue3/api'],
    //       target: process.env.VUE_APP_API_HOST,
    //       changeOrigin: true,
    //       secure: false,
    //       xfwd: false,
    //       pathRewrite: { '/vue2-pc/api': '/', '/vue2-mobile/api': '/', '/vue3/api': '/' },
    //     },
    //   ],
    // },
    // 如后续需要额外 Define 或插件，可通过这些参数传入
    define: {},
    plugins: [],
  });

  return builder.createConfig();
};
