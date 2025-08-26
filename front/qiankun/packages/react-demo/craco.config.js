const path = require("path");
const { createProxyMiddleware } = require('http-proxy-middleware');
const envConfig = require("./config/env");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },
  devServer: (devServerConfig) => {
    devServerConfig.headers = { "Access-Control-Allow-Origin": "*" };
    devServerConfig.historyApiFallback = true;
    devServerConfig.hot = true;
    devServerConfig.liveReload = false;
    devServerConfig.open = true;
    devServerConfig.port = 8004;
    devServerConfig.static = "./src";
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      devServer.app.use(
        envConfig.apiPath,
        createProxyMiddleware({
          target: envConfig.api,
          changeOrigin: true,
          ws: true,
          pathRewrite: { [`^${envConfig.apiPath}`]: "" },
        })
      );
      return middlewares;
    };
    return devServerConfig;
  },
};
