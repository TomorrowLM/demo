const path = require("path");
const { getProjectInfo } = require("../core/scripts/app.js");
const { getEnvConfig } = require("../core/scripts/env.js");
let pluginHelpers = require("./plugin.js");
let QiankunClass = require('../qiankun/index.js')
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
    this.QiankunInstance = new QiankunClass(); // 初始化 qiankun 实例
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
    const isDev = !this.GLOBAL_CONFIG.IS_PROD;
    const env = this.GLOBAL_CONFIG.ENV_CONFIG || {};
    const { IS_QIANKUN } = env;
    const HtmlWebpackPlugin = helpers.safeRequire("html-webpack-plugin");
    const MiniCssExtractPlugin = helpers.safeRequire("mini-css-extract-plugin");
    const BundleAnalyzerPlugin = (() => {
      const p = helpers.safeRequire('webpack-bundle-analyzer');
      return p && (p.BundleAnalyzerPlugin || p.BundleAnalyzer) ? (p.BundleAnalyzerPlugin || p.BundleAnalyzer) : null;
    })();
    const lessRegex = /\.less$/;
    const lessModuleRegex = /\.module\.less$/;
    console.log('[shared]WebpackBaseBuilder createConfig:', isDev, helpers.fetchProxyEntry(this.GLOBAL_CONFIG));
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
      // 调整性能提示：默认 webpack 在 production 下对单个 asset 的建议上限是 ~250000 bytes（约 244 KiB），
      // 因为项目中存在较大第三方库（如 AntV），这里将上限提高到 1MB，以避免频繁警告。
      performance: {
        hints: "warning",
        maxAssetSize: 100000000,
        maxEntrypointSize: 100000000,
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
          maxSize: 300000,
          cacheGroups: {
            // antv: {
            //   test: /[\\/]node_modules[\\/](?:@antv)[\\/]/,
            //   chunks: "all",
            //   name: "antv-vendors",
            //   priority: 20,
            //   enforce: true,
            //   reuseExistingChunk: true // 允许复用已经存在的代码块
            // },
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
    if (IS_QIANKUN) {
      this.QiankunInstance.setOutputConfig(config);
    }

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
          // 忽略 CSS 顺序冲突（避免 MiniCssExtractPlugin 报错/警告）
          ignoreOrder: true,
        })
      );
    }

    // Bundle analyzer (only when BUNDLE_ANALYZE=true)
    if (BundleAnalyzerPlugin) {
      console.log('Enable BundleAnalyzerPlugin as BUNDLE_ANALYZE=true', BundleAnalyzerPlugin ? 1 : 0);
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: path.resolve(this.options.outputPath || './', 'bundle-report.html'),
        })
      );
    }


    return config;
  }
}

module.exports = WebpackBaseBuilder;
