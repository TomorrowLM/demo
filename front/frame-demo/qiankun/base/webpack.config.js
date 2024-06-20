const path = require("path");
const webpack = require("webpack");
const packageName = require("./package.json").name;
//生成创建Html入口文件
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDev = process.env.NODE_ENV === "development" ? true : false;
const globalConstants = require('../config/envConfig/env.dev.js')
const { PUBLIC_URL } = globalConstants;
console.log(PUBLIC_URL, globalConstants);
module.exports = () => {
  const config = {
    mode: process.env.NODE_ENV,
    devtool: isDev ? "eval-cheap-module-source-map" : 'source-map',
    entry: {
      app: path.resolve(__dirname, "./src/main.js"),
    },
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "js/[name].[hash].js", //输出文件名
      publicPath: isDev ? '/' : '/qiankun', //资源访问根路径
      // library: `${packageName}-[name]`,
      // libraryTarget: "umd",
      // chunkLoadingGlobal: `webpackJsonp_${packageName}`,
    },
    devServer: {
      /**
       * 解决使用history模式，SPA页面在路由跳转之后，访问不到后端资源，返回404错误
       */
      historyApiFallback: true,
      /**
       *  配置dev-server命令参数的第二种形式: "dev": "webpack-dev-server --open --port 3000 --contentBase src --hot"
       */
      open: true, //自动打开浏览器
      port: 3500,
      static: "./public", //指定静态资源目录
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: [
        {
          context: ['/vue2-mobile/api'],
          target: 'http://localhost:8001',
          // changeOrigin: true,
          // secure: false,
          // xfwd: false,
          // pathRewrite: { '^/api': '' }  //重点：重写资源访问路径，避免转发请求 404问题
        },
        {
          context: ['/vue2-pc/api'],
          target: 'http://localhost:8002',
        }
      ]
    },
    optimization: {
      // moduleIds: isDev ? 'named' : 'deterministic',
      // chunkIds: isDev ? 'named' : 'deter
      splitChunks: {
        // 代码分割
        chunks: "all",
        maxInitialRequests: Infinity, // 最大并行请求数，为了以防万一，设置无穷大即可
        minSize: 20000, // 引入的模块大于20kb才做代码分割，官方默认20000，这里不用修改了
        maxSize: 60000, // 若引入的模块大于60kb，则告诉webpack尝试再进行拆分
        cacheGroups: {
          vendors: {
            //node_modules里的代码
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            name: "vendors", //chunks name
            priority: 10, //优先级
            enforce: true,
          },
        },
      },
    },
    plugins: [
      //开发中，创建一个在内存中生成Html页面的插件。打包中，用来生成HTML文件并自动引用打包好的JS文件
      new HtmlWebpackPlugin({
        //模板文件路径
        template: path.join(__dirname, "public/index.html"),
        //模板文件名
        filename: "index.html",
        title: "react app",
        minify: {
          //压缩html文件
          removeComments: true, //移出html中的注释
          collapseWhitespace: false, //删除空白符与换行符
          removeAttributeQuotes: true, //删除双引号,
          collapseWhitespace: true, //压缩成一行，
        },
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].[hash].css", // 定义抽离的入口文件的文件名
        chunkFilename: "css/[name].[hash].css", // 定义非入口块文件的名称，如动态导入的文件
      }),
      new webpack.DefinePlugin({
        API: JSON.stringify(globalConstants)
      })
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // "style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            // 如果想要启用 CSS 模块化，可以为 css-loader 添加 modules 参数即可
          ],
        },
        {
          test: /\.(jsx|js|ts|tsx)$/,
          exclude: /node_modules/,
          // use: {
          //   loader: "babel-loader?cacheDirectory", // 开启缓存
          //   options: {
          //     // ...
          //   },
          // },
          loader: "babel-loader",
          options: {
            cacheDirectory: true, //缓存，第二次打包速度会提高
            cacheCompression: false, //缓存不做压缩，打包速度也会快一点
            // plugins: ["react-refresh/babel"], //使能JS的HMR
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      ],
    },
  };

  return config;
};
