//引入webpack-merge插件进行合并
const { merge } = require("webpack-merge");
//分析打包后的依赖包大小
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
//引入webpack.base.conf.js文件
const base = require("./webpack.base");
//引入webpack
const webpack = require("webpack");
//进行合并，将webpack.base.conf.js中的配置合并到这
module.exports = merge(base, {
  //模块参数
  mode: "development",
  devtool: "eval-cheap-module-source-map", // 现实对应报错文件的位置
  devServer: {
    //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    historyApiFallback: true,
    //配置dev-server命令参数的第二种形式
    // "dev": "webpack-dev-server --open --port 3000 --contentBase src --hot"
    open: true, //自动打开浏览器
    port: 3500,
    // contentBase: "./src", //指定托管的根目录
    static: "./src", //指定托管的根目录
    hot: true, //启动热更新
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),//new一个热更新的模块对象
  ],
});
