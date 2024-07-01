const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const base = require("./webpack.base");
//清除build/dist文件夹文件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(base, {
  //会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 production
  mode: "production",
  devtool: 'source-map',
  plugins: [
    //使用插件定义全局变量DEV
    new webpack.DefinePlugin({
      DEV: JSON.stringify("production"),
    }),
    //使用插件清除dist文件夹中的文件
    new CleanWebpackPlugin({
      path: "./dist",
    }),
  ],
  // 第三方包入口
  // 从 CDN 引入 jQuery，而不是把它打包
  // vendor: ['react', 'react-router', 'react-redux', 'moment', 'antd'],
  // splitChunks: {
  //   cacheGroups: {
  //     commons: {
  //       test: /[\\/]node_modules[\\/]/,
  //       name: 'vendors',
  //       chunks: 'all',
  //     }
  //   }
  // },
});
