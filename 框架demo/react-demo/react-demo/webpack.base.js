const path = require("path");
const webpack = require("webpack");
//生成创建Html入口文件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 分离 css 到独立的文件中
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
//编译进度
const WebpackBar = require("webpackbar");
//分析编译时间
//const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();

//配置域名环境
const envConfig = require("./env");
const NODE_ENV = process.env.NODE_ENV;
console.log("当前环境", NODE_ENV);
module.exports = {
  //webpack 入口文件
  entry: {
   app: path.resolve(__dirname, "./src/main.js"),
  },
  //多文件配置
  // entry: {
  //   pageOne: './src/pageOne/index.js',
  //   pageTwo: './src/pageTwo/index.js',
  //   pageThree: './src/pageThree/index.js',
  // },
  //webpack 输出文件配置
  output: {
    //指定打包好的文件，输出到哪个目录中去
    path: path.resolve(__dirname, "./dist"),
    //输出文件名
    filename: "js/bundle.[hash].js",
    //静态文件打包存放的目录.静态文件是指项目中引用css，js，img等资源时候的一个基础路径.静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
    // publicPath: process.env.NODE_ENV === 'production'
    // ? '/react-demo/'
    // : '/',
  },
  //配置插件
  plugins: [
    new WebpackBar(),
    //开发中，创建一个在内存中生成Html页面的插件。打包中，用来生成HTML文件并自动引用打包好的JS文件
    new HtmlWebpackPlugin({
      //模板文件路径
      template: path.join(__dirname, "./src/index.html"),
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
      hash: true,
      // cdn: assetsCDN
    }),
    new MiniCssExtractPlugin({
      filename: `css/[name]-[hash].css`
    }),
    new CssMinimizerWebpackPlugin(),
    //定义全局变量
    new webpack.DefinePlugin({
      //定义全局变量
      API: JSON.stringify(envConfig),
    }),
  ],
  resolve: {
    modules: [path.resolve("node_modules")], //只在当前目录下查找
    extensions: [".js", ".jsx"],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  //loader加载器模块配置
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          //'style-loader', 'css-loader'
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },// 如果想要启用 CSS 模块化，可以为 css-loader 添加 modules 参数即可
        ]
      },
      {
        test: /\.less$/i,
        use: [
          // {
          //   loader: 'style-loader', // 从 JS 中创建样式节点
          // },
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // 转化 CSS 为 CommonJS
            options: {
              sourceMap: true,
              modules: {
                localIdentName: "[local]___[hash:base64:5]",
              },
              // exclude: [
              //   path.resolve(__dirname, "node_modules")
              // ],
            }
          },
          {
            loader: 'less-loader', // 编译 Less 为 CSS
          },
        ],
      },
      {
        test: /\.(png|svg|jpeg|jpg|gif)$/,
        type: "asset/resource",
      },
      {
        test: /(\.jsx|\.js)$/,
        use: ["babel-loader"],
        // include: path.resolve(__dirname, "./src"),
        exclude: /node_modules/,
      },
    ],
  },
  //通过script标签外部链接引入公共库文件，减少打包速度和公共包体积
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM',
  //   'jquery': 'jQuery',
  // },
  //缓存生成的 webpack 模块和 chunk，能够改善构建速度
  cache: {
    type: "filesystem",
    // 默认缓存到 node_modules/.cache/webpack 中
    // 也可以自定义缓存目录
    // cacheDirectory:path.resolve(__dirname,'node_modules/.cac/webpack')
    buildDependencies: {
      // 更改配置文件时，重新缓存
      config: [__filename],
    },
  },
  //资源(asset)和入口起点超过指定文件限制
  // performance: {
  //   hints: "error", // 枚举
  //   maxAssetSize: 50000000, // 整数类型（以字节为单位）
  //   maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
  //   assetFilter: function (assetFilename) {
  //     // 提供资源文件名的断言函数
  //     return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
  //   }
  // }
};
