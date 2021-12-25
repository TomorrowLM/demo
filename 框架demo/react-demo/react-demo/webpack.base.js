const path = require("path");
const webpack = require("webpack");
//生成创建Html入口文件
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
  entry: path.resolve(__dirname, "./src/main.js"),
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
    filename: "js/bundle.js",
    // publicPath: '/static/',//publicPath是你启用服务器（webpack-dev-server/react-hot-loader）时的路径
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
    }),
    //定义全局变量
    new webpack.DefinePlugin({
      //定义全局变量
      API: JSON.stringify(envConfig),
    }),
  ],
  resolve: {
    modules: [path.resolve("node_modules")], //只在当前目录下查找
    extensions: [".js", ".jsx"],
  },
  //loader加载器模块配置
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader",
          {
            loader: 'css-loader',
            // options: {
            //   modules: {
            //     // localIdentName: "[local]___[hash:base64:5]",
            //   },
            // }
          },// 如果想要启用 CSS 模块化，可以为 css-loader 添加 modules 参数即可
        ]
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: 'style-loader', // 从 JS 中创建样式节点
          },
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
  performance: {
    hints: 'error',
    maxAssetSize: 300000, // 整数类型（以字节为单位）
    maxEntrypointSize: 500000 // 整数类型（以字节为单位）
  }
};
