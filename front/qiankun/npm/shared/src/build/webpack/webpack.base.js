const path = require("path");
const { getProjectInfo } = require("../core/scripts/app.js");
const { getEnvConfig } = require("../core/scripts/env.js");
let pluginHelpers = require("./plugin.js");
let helpers = pluginHelpers.helpers;
/**
 * 通用 Webpack 构建器（非 Vue CLI 场景）
 * - 参考 vue-demo-pc 的 Vue2CliBuilder 写法，提供 createConfig 方法
 * - 由各具体项目（如 packages/base）在自己的 webpack.config.js 中调用
 */
class WebpackBaseBuilder {
  constructor(options = {}) {
    this.GLOBAL_CONFIG = {
      ENV_CONFIG: getEnvConfig(process.env.APP_ENV),
      APP_INFO: getProjectInfo(),
      APP_ENV: process.env.APP_ENV || "development",
      IS_DEV: process.env.APP_ENV === "development",
    };
    const { APP_OUTPUTDIR, Build_Path, IS_PROD } = this.GLOBAL_CONFIG.ENV_CONFIG;
    this.options = Object.assign(
      {
        // 业务入口、输出、publicPath 由项目层传入
        entry: path.resolve(process.cwd(), "./src/main.tsx"),
        outputPath: APP_OUTPUTDIR,
        publicPath: IS_PROD ? Build_Path : "/",
        htmlOptions: {},
        define: {},
        plugins: [],
        devServer: undefined,
      },
      options
    );

    // 确保 outputPath 为绝对路径（Webpack 要求）
    if (this.options.outputPath && !path.isAbsolute(this.options.outputPath)) {
      this.options.outputPath = path.resolve(process.cwd(), this.options.outputPath);
    }
  }
  // 通用插件工厂方法
  commonPluginFactory() {
    return [helpers.fetchDefinePlugin()];
  }
  getTools() {
    return {
    };
  }
  /**
   * 生成基础 Webpack 配置
   * - 包含 entry/output/resolve/optimization/module/plugins 的通用约定
   * - 具体项目可在外层对返回的 config 进行二次扩展
   */
  createConfig() {
    const isDev = this.GLOBAL_CONFIG.IS_DEV;
    const env = this.GLOBAL_CONFIG.ENV_CONFIG || {};
    const HtmlWebpackPlugin = helpers.safeRequire("html-webpack-plugin");
    const MiniCssExtractPlugin = helpers.safeRequire("mini-css-extract-plugin");
    const APP_NAME = this.GLOBAL_CONFIG.APP_INFO.APP_NAME || "app";
    const lessRegex = /\.less$/;
    const lessModuleRegex = /\.module\.less$/;

    const config = {
      mode: isDev ? "development" : "production",
      devtool: isDev ? "eval-cheap-module-source-map" : "cheap-source-map",
      entry: {
        app: this.options.entry,
      },
      output: {
        path: this.options.outputPath,
        publicPath: this.options.publicPath,
      },
      devServer: helpers.fetchProxyEntry(this.GLOBAL_CONFIG),
      resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: helpers.fetchAlias(),
      },
      optimization: {
        splitChunks: {
          chunks: "all",
          maxInitialRequests: Infinity,
          minSize: 20000,
          maxSize: 60000,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              chunks: "all",
              name: "vendors",
              priority: 10,
              enforce: true,
            },
          },
        },
      },
      plugins: [
        ...this.commonPluginFactory()
      ],
      module: {
        rules: [],
      },
    };
    console.log('[shared]WebpackBaseBuilder config.output:', config.output);
    // 统一文件名 hash 策略
    helpers.applyFilenameHashing(config, !isDev);

    const styleLoader = MiniCssExtractPlugin
      ? MiniCssExtractPlugin.loader
      : "style-loader";

    // CSS / Less 相关规则
    config.module.rules.push(
      {
        test: /\.css$/,
        use: [styleLoader, "css-loader"],
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: lessModuleRegex,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: {
                localIdentName: "[local]___[hash:base64:5]",
              },
            },
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(jsx|js|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          presets: [
            "@babel/preset-env",
            ["@babel/preset-react", { runtime: "automatic" }],
            "@babel/preset-typescript",
          ],
        },
      }
    );

    // HtmlWebpackPlugin
    if (HtmlWebpackPlugin) {
      config.plugins.push(
        new HtmlWebpackPlugin(
          Object.assign(
            {
              template: path.join(process.cwd(), "public/index.html"),
              filename: "index.html",
              title: "react app",
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
              },
            },
            this.options.htmlOptions || {}
          )
        )
      );
    }

    // 抽离 CSS 插件
    if (MiniCssExtractPlugin) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: "css/[name].[hash].css",
          chunkFilename: "css/[name].[hash].css",
        })
      );
    }


    return config;
  }
}

module.exports = WebpackBaseBuilder;
