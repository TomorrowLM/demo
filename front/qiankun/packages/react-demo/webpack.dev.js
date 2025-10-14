const { merge } = require("webpack-merge");//引入webpack-merge插件进行合并
const { webpackConfig, qiankunConfig } = require("@lm/shared/config");//引入webpack配置，使用包导出路径
const { configBuilder } = webpackConfig.default;
const { getQiankunConfig, qiankunConfigFn } = qiankunConfig.default;
const { name } = require("./package.json");

// 创建自定义配置，不包含CSS处理
const webpackConfig1 = configBuilder
  .addPlugin('WebpackBar')
  .addPlugin('HtmlWebpackPlugin')
  .addPlugin('DefinePlugin')
  .addPlugin('ProvidePlugin', {
    process: 'process/browser',
    Buffer: ['buffer', 'Buffer']
  })
  .addPlugin('NodePolyfillPlugin', {
    excludeAliases: []
  })
  .addLoader('babel')
  .addLoader('css')
  .addLoader('less')
  .addLoader('images', { maxSize: 10 * 1024 })
  .addLoader('fonts')
  .getConfig();
console.log(configBuilder, 99);
console.log(webpackConfig, 'webpackConfig', qiankunConfigFn({ projectName: name, config: { output: {} } }));
// 创建配置并与自定义配置合并
module.exports = merge(webpackConfig1, {
  output: getQiankunConfig(name),
  //模块参数,会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development
  mode: "development",
  devtool: "eval-cheap-module-source-map", // 现实对应报错文件的位置
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    historyApiFallback: true,
    //配置dev-server命令参数的第二种形式
    // "dev": "webpack-dev-server --open --port 3000 --contentBase src --hot"
    open: true, //自动打开浏览器
    port: 8004,
    // contentBase: "./src", //指定托管的根目录
    static: "./src", //指定托管的根目录
    hot: true,
  },
});