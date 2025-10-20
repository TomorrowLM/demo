const path = require("path");
const webpack = require("webpack");
const { name } = require('./package');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const LM_ENV_CONFIG = require("../packages/react-demo/config/env");
const { createProxyMiddleware } = require('http-proxy-middleware');
const NODE_ENV = process.env.NODE_ENV;
console.log("当前环境", NODE_ENV);

module.exports = {
  babel: {
    presets: [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": "entry",
          "corejs": {
            // core-js的版本
            "version": 3
          },
          "targets": {
            "edge": "17",
            "firefox": "60",
            "chrome": "67",
            "safari": "11.1",
            "ie": "8"
          }
        }
      ],
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    plugins: [
      //按需加载
      ["import", { "libraryName": "antd", "style": true }]
    ]
  },
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';

    if (NODE_ENV === 'development') {
      config.mode = "development";
      config.devtool = "eval-cheap-module-source-map";
      config.devServer = {
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: true,
        hot: true,
        liveReload: false,
        open: true,
        port: 8004,
        static: "./src",
        setupMiddlewares: (middlewares, devServer) => {
          devServer.app.use(
            LM_ENV_CONFIG.apiPath,
            createProxyMiddleware({
              target: LM_ENV_CONFIG.api,
              changeOrigin: true,
              ws: true,
              pathRewrite: { [`^${LM_ENV_CONFIG.apiPath}`]: '' }
            })
          );
          return middlewares;
        }
      };
    } else if (NODE_ENV === 'production') {
      config.mode = "production";
      config.devtool = 'source-map';
    }

    config.entry = { app: path.resolve(__dirname, "./src/index.js") };
    Object.assign(config.output, {
      path: path.resolve(__dirname, "./dist"),
      filename: "js/bundle.[fullhash].js",
    });

    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    config.resolve.modules = [path.resolve(__dirname, "node_modules"), ...(config.resolve.modules || [])];
    config.resolve.extensions = ['.js', '.jsx', '.json', '.ts', '.tsx', ...(config.resolve.extensions || [])];
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');

    const basePlugins = [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "./src/index.html"),
        filename: "index.html",
        title: "react app",
        minify: { removeComments: true, collapseWhitespace: true, removeAttributeQuotes: true },
        hash: true,
      }),
      new webpack.DefinePlugin({ LM_ENV_CONFIG: JSON.stringify(LM_ENV_CONFIG) }),
      new NodePolyfillPlugin()
    ];

    if (NODE_ENV === 'development') {
      basePlugins.push(new webpack.HotModuleReplacementPlugin());
    } else if (NODE_ENV === 'production') {
      basePlugins.push(
        new MiniCssExtractPlugin({ filename: `css/[name]-[fullhash].css` }),
        new CssMinimizerWebpackPlugin(),
        new webpack.DefinePlugin({ DEV: JSON.stringify("production") }),
        new CleanWebpackPlugin({ path: "./dist" })
      );
    }

    config.plugins = [...(config.plugins || []), ...basePlugins];

    if (!config.module) config.module = { rules: [] };
    const moduleRules = [
      {
        test: /\.css$/,
        use: [NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/i,
        use: [
          NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true, modules: { localIdentName: "[local]___[hash:base64:5]" } }
          },
          { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true } } }
        ],
      },
      {
        test: /\.(png|svg|jpeg|jpg|gif)$/i,
        type: "asset/resource",
        parser: { dataUrlCondition: { maxSize: 8 * 1024 } }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset/resource',
        generator: { filename: "font/[name].[fullhash:4][ext]" },
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader?cacheDirectory' }
      },
    ];
    config.module.rules = [...moduleRules, ...(config.module.rules || [])];

    if (NODE_ENV === 'development') {
      config.cache = { type: 'memory' };
      config.optimization = { removeAvailableModules: false, removeEmptyChunks: false, splitChunks: false };
    }

    return config;
  }
};
