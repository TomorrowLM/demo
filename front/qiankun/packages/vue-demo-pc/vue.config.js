const path = require('path');

const { defineConfig } = require('@vue/cli-service');

const autoprefixer = require('autoprefixer'); // 自动在样式中添加浏览器厂商前缀，避免手动处理样式兼容问题
const webpack = require('webpack');
const { webpackBaseConfig, commonPlugin, aliasConfigFn } = require('@lm/shared/src/config/vue');

const resolve = dir => path.join(__dirname, dir);
const isProd = process.env.NODE_ENV === 'production';
const name = require('./package.json').name;


console.log(process.env.NODE_ENV, process.env.BASE_URL, process.env.VUE_APP_API_HOST);
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-demo-pc/' : '/',
  // 打包文件输出路径，即打包到哪里
  outputDir: 'dist',
  // assetsDir: 'assets',//静态资源目录(js,css,img,fonts)这些文件都可以写里面
  lintOnSave: true, // boolean | 'warning' | 'default' | 'error'
  transpileDependencies: true,
  productionSourceMap: !isProd, // 生产环境是否生成 sourceMap 文件
  devServer: {
    // contentBase: './src',//项目基本访问目录
    host: 'localhost', // 服务器ip地址
    port: 8002,
    open: true, // 配置自动启动浏览器
    hot: true, // 模块热替换
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      [process.env.VUE_APP_BASE_URL]: {
        // target: 'http://lm-web.top:3600/',
        // target: 'http://localhost:3600',
        target: process.env.VUE_APP_API_HOST,
        changeOrigin: true,
        secure: false,
        xfwd: false,
        pathRewrite: { [process.env.VUE_APP_BASE_URL]: '' } // 重点：重写资源访问路径，避免转发请求 404问题
      }
    }
  },
  configureWebpack: config => {
    config.plugins.push(...commonPlugin);
    console.log(222, aliasConfigFn(resolve))
    config.resolve.alias = {
      ...(aliasConfigFn(resolve) || {}),
      // '@': path.resolve(__dirname, 'src'),
      // 'components': path.resolve(__dirname, 'src/components'),
      // 你可以在这里添加更多的 alias
    };
    config.externals = {
      BMap: 'window.BMap', // 百度地图
      AMap: 'AMap' // 高德地图}
    }
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd'; // 把微应用打包成 umd 库格式
    config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;// webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    if (process.env.NODE_ENV === 'production') {
      config.output.filename = 'js/[name].[contenthash].js';
      config.output.chunkFilename = 'js/[name].[contenthash].js';
    }
  },

  chainWebpack: config => {
    // config.resolve.alias
    //   .set('@', resolve('src'))
    //   .set('assets', resolve('src/assets'))
    //   .set('components', resolve('src/components'))
    //   .set('public', resolve('public'));
    // webpackBaseConfig(config)
    // TODO
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';// 把微应用打包成 umd 库格式
    config.output.jsonpFunction = `webpackJsonp_${name}`;// webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    if (process.env.NODE_ENV === 'development') {
      config.optimization.minimize(true); // 开启压缩js代码
      config.optimization.splitChunks({
        // 开启代码分割
        chunks: 'all'
      });
    } else {
      // console.log(config);
    }
  },
  css: {
    extract: {
      ignoreOrder: true // 解决组件的引入必须先后顺序一致
    }, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false,
    loaderOptions: {
      sass: {
        additionalData: '@import "@/styles/index.scss";', // 注入全局样式
        implementation: require('sass'), // 使用 Dart Sass
        // plugins: [
        //   autoprefixer({
        //     overrideBrowserslist: [
        //       'Android 4.1',
        //       'iOS 7.1',
        //       'Chrome > 31',
        //       'ff > 31',
        //       'ie >= 8',
        //       'last 10 versions' // 所有主流浏览器最近10版本用
        //     ],
        //     grid: true
        //   })
        // ]
      },
    }
  }
});
