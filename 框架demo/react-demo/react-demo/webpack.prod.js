const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const base = require("./webpack.base");
//压缩代码
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// 分离 css 到独立的文件中
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
//清除build/dist文件夹文件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(base, {
  //会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 production
  mode: "production",
  devtool: 'source-map',
  // 第三方包入口
  // vendor: ['react', 'react-router', 'react-redux', 'moment', 'antd'],
  module: {
    rules: [{
      test: /.s?css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
    }, {
      test: /\.jpg$/,
      type: 'asset/resource'
    }],
  },
  plugins: [
    //使用插件定义全局变量DEV
    new webpack.DefinePlugin({
      DEV: JSON.stringify("production"),
    }),
    //使用插件清除dist文件夹中的文件
    new CleanWebpackPlugin({
      path: "./dist",
    }),
    new MiniCssExtractPlugin({
      filename: `css/[name]-[contenthash].css`
    }),
    new CssMinimizerWebpackPlugin(),
  ],
  performance: {
    hints: "warning", // 枚举
    maxAssetSize: 5000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 5000000, // 整数类型（以字节为单位）
    assetFilter: function (assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  }
});
