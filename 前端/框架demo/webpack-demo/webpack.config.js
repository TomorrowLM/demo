const path = require("path");
const resolve = _path => path.resolve(__dirname, _path);
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
//生成创建Html入口文件
const HtmlPlugin = require('html-webpack-plugin')

console.log(process.env.NODE_ENV);
const plugins = (() => {
  const devPlugins = [
    //使用插件生成Html入口文件
    new HtmlPlugin({
      //模板文件路径
      template: "./public/index.html",
      //模板文件名
      filename: "index.html",
      minify: {
        removeAttributeQuotes: true, //删除双引号,
        // collapseWhitespace: true,    //压缩成一行，
      },
      hash: true
    }),
  ]
  if (process.env.NODE_ENV === 'development') {
    return [...devPlugins]
  }
  if (process.env.NODE_ENV === 'production') {
    // new BundleAnalyzerPlugin(),
    return [new BundleAnalyzerPlugin(), ...devPlugins]
  }
})()

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: { // 配置多入口文件
    index: './src/index.js',
    // lodash: './src/doubleIndex.js',
    // index: {
    //   import: './src/index.js', // 启动时需加载的模块
    //   dependOn: 'common_chunk', // 当前入口所依赖的入口
    // },
    // lodash: {
    //   import: './src/lodash.js',
    //   dependOn: 'common_chunk',
    // },
    // common_chunk: 'lodash' // 当上面两个模块有lodash这个模块时，就提取出来并命名为shared chunk
  },
  //虽然在webpack中允许每个页面有多个入口点，但在可能的情况下，应该避免使用多个入口点，最好使用一个入口多个引入
  //entry: { page: ['./analytics', './app'] }//这样在引入异步脚本时，会有更好的优化和一致的执行顺序。
  output: {
    filename: "js/[name].bundle.js",
    chunkFilename: "js/[name].chunk-test.js",//打包异步代码，动态导入
    path: path.join(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    open: true,//初次打包完成后，自动打开浏览器
    host: '127.0.0.1',//实时打包所使用的主机地址
    port: 8800 //实时打包所使用的端口号
  },
  optimization: {
    runtimeChunk: 'single',//针对下面多个入口文件，相同的模块是不会共享的解决方案
    splitChunks: { // 代码分割,提取模块。但是有多个入口文件的话。文件中引入相同的模块是不会共享
      // include all types of chunks
      chunks: 'all'
    }
  },
  plugins,
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       include: path.resolve(__dirname, './src'),
  //       use: {
  //         loader: 'babel-loader',
  //         options: {
  //           cacheDirectory: true
  //         }
  //       }
  //     }
  //   ]
  // }
};