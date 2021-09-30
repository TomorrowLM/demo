const path = require("path");
//清除build/dist文件夹文件
const CleanWebpackPlugin = require("clean-webpack-plugin");
//生成创建Html入口文件
const HtmlWebpackPlugin = require("html-webpack-plugin");
//将css提取到单独的文件中
const MiniCssExtract = require("mini-css-extract-plugin");
//css压缩
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
//压缩js文件
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
//引入webpack
const webpack = require("webpack");

module.exports = {
  //webpack 入口文件
  entry: "./src/index.js",
  //webpack 输出文件配置
  output: {
    //输出文件路径
    path: path.resolve(__dirname, "dist"),
    //输出文件名
    filename: "k-editor.[hash:8].js",
  },
  //配置插件
  plugins: [
    //使用插件清除dist文件夹中的文件
    new CleanWebpackPlugin({
      path: "./dist",
    }),
    //使用插件生成Html入口文件
    new HtmlWebpackPlugin({
      //模板文件路径
      template: "./src/index.html",
      //模板文件名
      filename: "index.html",
      minify: {
        removeAttributeQuotes: true, //删除双引号,
        collapseWhitespace: true, //压缩成一行，
      },
      hash: true,
    }),
    //提取css到style.css中
    new MiniCssExtract({
      filename: "style.css",
    }),
  ],
  resolve: {
    // modules: [path.resolve('node_modules')],//只在当前目录下查找
    alias: {
      //别名
      bootstrap: "bootstrap/dist/css/bootstrap.css",
    },
    // mainFields: ['style', 'main'],//优先寻找style，
    // mainFiles: [],//入口文件的名字,默认index.js
    // extensions: ['js', 'css', 'json', 'vue']//扩展名顺序
  },
  //loader加载器模块配置
  module: {
    rules: [
      {
        //正则表达式匹配.css为后缀的文件
        test: /\.css$/,
        //使用loader
        use: [
          MiniCssExtract.loader,
          "css-loader",
          {
            loader: "postcss-loader",
          },
        ],
        //正则表达式匹配.less为后缀的文件
        //使用lodaer来处理
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtract.loader,
          "css-loader",
          {
            loader: "postcss-loader",
          },
          "less-loader",
        ],
      },
      /* {
                 test: /\.js$/,
               //不包括node_modules
                 exclude: /node_modules/,
                 use: [{
                     loader: "eslint-loader",
                     options: {
                         enforce: 'pre'    //强制更改顺序，pre 前  post 后
                     }
                 }],
             },*/
      {
        test: /\.js$/, //普通的loader
        //不包括node_modules
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        use: ["html-withimg-loader"],
      },
      {
        test: /\.(gif|png|jpg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              //图片小于10kb就是图片地址，大于正常打包成base64格式编码
              limit: 10000,
              //输出路径
              outputPath: "img/",
            },
          },
        ],
      },
    ],
  },
};
