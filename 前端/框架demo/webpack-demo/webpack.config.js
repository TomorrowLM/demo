const path = require("path");
const resolve = _path => path.resolve(__dirname, _path);
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
//清除build/dist文件夹文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
//生成创建Html入口文件
const HtmlPlugin = require('html-webpack-plugin')

console.log(process.env.NODE_ENV);
const plugins = (() => {
  const devPlugins = [
    //使用插件清除dist文件夹中的文件
    new CleanWebpackPlugin(),
    //使用插件生成Html入口文件
    new HtmlPlugin({
      //模板文件路径
      template: "./public/index.html",
      //模板文件名
      filename: "index.html",
      minify: {
        removeAttributeQuotes: true, //删除双引号,
        collapseWhitespace: true,    //压缩成一行，
      },
      hash: true
    }),
  ]
  if (process.env.NODE_ENV === 'development') {
    return [...devPlugins]
  }
  if (process.env.NODE_ENV === 'production') {
    // new BundleAnalyzerPlugin(),
    return [ ...devPlugins]
  }
})()

// console.log(plugins);
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: { // 配置多入口文件
    index: './src/index.js',
    lodash: './src/lodash.js'
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, 'dist')
  },
  devServer: {
    open: true,//初次打包完成后，自动打开浏览器
    host: '127.0.0.1',//实时打包所使用的主机地址
    port: 8800 //实时打包所使用的端口号
  },
  plugins
};