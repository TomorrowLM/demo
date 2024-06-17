const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const webpack = require('webpack');
// const pxtorem = require('postcss-pxtorem')
const autoprefixer = require('autoprefixer'); // 自动在样式中添加浏览器厂商前缀，避免手动处理样式兼容问题
const resolve = dir => path.join(__dirname, dir);
const isProd = process.env.NODE_ENV === 'production';
const name = require("./package.json").name;
const commonPlugin = [
  // 扩展环境变量
  // new webpack.DefinePlugin({
  //   BASE_URL: JSON.stringify(process.env.BASE_URL)
  // })
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment/,
  }),
  // 自动加载模块，而不必到处 import 或 require ，在这里加载模块之后，组件内部就不用inport引入了
  new webpack.ProvidePlugin({
    $_: 'lodash',
    moment: 'moment',
  }),
  new webpack.DefinePlugin({
    pageSize: 15,
  }),
];

console.log(process.env.NODE_ENV, process.env.VUE_APP_API_HOST);
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-demo-pc/' : '/',
  //打包文件输出路径，即打包到哪里
  outputDir: 'dist',
  // assetsDir: 'assets',//静态资源目录(js,css,img,fonts)这些文件都可以写里面
  lintOnSave: true, //boolean | 'warning' | 'default' | 'error'
  transpileDependencies: true,
  productionSourceMap: !isProd, // 生产环境是否生成 sourceMap 文件
  devServer: {
    // contentBase: './src',//项目基本访问目录
    host: 'localhost', //服务器ip地址
    port: 8002,
    open: true, // 配置自动启动浏览器
    hot: true, //模块热替换
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // public: 'http://192.168.10.36:8088',
    proxy: {
      '/api': {
        target: 'http://lm-web.top:3600/',
        changeOrigin: true,
        secure: false,
        xfwd: false,
      },
    },
  },
  configureWebpack: config => {
    config.plugins.push(...commonPlugin);
    config.externals = {
      BMap: 'window.BMap', // 百度地图
      AMap: 'AMap', // 高德地图}
    }
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = "umd"; // 把微应用打包成 umd 库格式
    config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;// webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    if (process.env.NODE_ENV === 'production') {
      config.output.filename = `js/[name].[contenthash].js`;
      config.output.chunkFilename = `js/[name].[contenthash].js`;

    }
  },

  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('public', resolve('public'));
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = "umd";// 把微应用打包成 umd 库格式
    config.output.jsonpFunction = `webpackJsonp_${name}`;// webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    if (process.env.NODE_ENV === 'development') {
      config.optimization.minimize(true); // 开启压缩js代码
      config.optimization.splitChunks({
        // 开启代码分割
        chunks: 'all',
      });
    } else {
      // console.log(config);
    }
  },
  css: {
    extract: {
      ignoreOrder: true, //解决组件的引入必须先后顺序一致
    }, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false,
    loaderOptions: {
      // postcss: {
      //   plugins: [
      //     autoprefixer({
      //       overrideBrowserslist: [
      //         "Android 4.1",
      //         "iOS 7.1",
      //         "Chrome > 31",
      //         "ff > 31",
      //         "ie >= 8",
      //         "last 10 versions", // 所有主流浏览器最近10版本用
      //       ],
      //       grid: true
      //     }),
      //     // pxtorem({
      //     //   // 之所以设为37.5，是为了引用像vant、mint-ui这样的第三方UI框架，
      //     //   // 因为第三方框架没有兼容rem，用的是px单位，将rootValue的值设置为设计图宽度（这里为750px）75的一半，即可以1:1还原vant、mint-ui的组件，否则会样式会有变化，例如按钮会变小。
      //     //   rootValue: 37.5,//根元素的值，即1rem的值.rem=设计稿元素尺寸/rootValue
      //     //   propList: ['*'],
      //     //   selectorBlackList: ['van'] // 过滤掉.van-开头的class，不进行rem转换
      //     // })
      //   ]
      // },
      sass: {
        additionalData: `@import "@/styles/theme.scss";`, //注入全局样式
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              'Android 4.1',
              'iOS 7.1',
              'Chrome > 31',
              'ff > 31',
              'ie >= 8',
              'last 10 versions', // 所有主流浏览器最近10版本用
            ],
            grid: true,
          }),
        ],
      },
      scss: {
        additionalData: `@import "@/styles/theme.scss";`, //注入全局样式
      },
    },
  },
});
