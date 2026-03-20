/* eslint-disable @typescript-eslint/no-var-requires */
const prod = process.env.NODE_ENV === 'production';
module.exports = {
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  pluginOptions: {
    qbee: {
      enhanceSourcemap: true,
    }
  },
  configureWebpack: prod
    ? {
        devtool: 'none', // 不打包sourcemap
      }
    : {},
  parallel: require('os').cpus().length > 1,
  devServer: {
    hot: true,
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: <%=DEV_SERVE_PORT%>,
    https: false,
    hotOnly: false,
    proxy: prod
      ? null
      : {
          '/': {
            target: process.env.APP_PROXY_URL, // 服务器地址
            changeOrigin: true, // 是否跨域,
            ws: false,
          },
        },
  },
};
