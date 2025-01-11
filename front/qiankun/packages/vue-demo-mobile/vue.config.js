const path = require('path');

const { commonPlugin, aliasConfigFn } = require('@lm/shared/lib/src/config/vue')
const utils = require('@lm/shared/lib/src/utils');
const autoprefixer = require('autoprefixer'); // 自动在样式中添加浏览器厂商前缀，避免手动处理样式兼容问题
const pxtorem = require('postcss-pxtorem');
const webpack = require('webpack');

const packageName = require('./package.json').name;
const name = require('./package.json').name;

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const resolve = (dir) => path.join(__dirname, dir);

console.log(process.env.NODE_ENV, process.env.VUE_APP_API_BASE_URL);
module.exports = {
  publicPath: isProd ? '/qiankun/child/vue2-mobile/' : '/',
  // 打包文件输出路径，即打包到哪里
  outputDir: 'dist',
  // assetsDir: 'assets',//静态资源目录(js,css,img,fonts)这些文件都可以写里面
  lintOnSave: true, // boolean | 'warning' | 'default' | 'error'
  productionSourceMap: !isProd, // 生产环境是否生成 sourceMap 文件
  devServer: {
    disableHostCheck: true, // webpack4.0 开启热更新
    contentBase: './src', // 项目基本访问目录
    // host: 'localhost',//服务器ip地址
    open: true,
    port: 8001,
    hot: true, // 模块热替换
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      [process.env.VUE_APP_BASE_URL]: {
        target: process.env.VUE_APP_API_HOST,
        changeOrigin: true,
        secure: false,
        xfwd: false,
        pathRewrite: { [process.env.VUE_APP_BASE_URL]: '' } // 重点：重写资源访问路径，避免转发请求 404问题
      }
    }
  },
  pwa: {
    name: 'vue-demo',
    short_name: 'vue-demo',
    themeColor: '#2F54EB', //  （index.html文件中也要设置）主题颜色，强烈建议和ui主题颜色保持一致，看起来更有原生app的感觉
    msTileColor: '#fff',
    skipWaiting: true,
    clientsClaim: true,
    display: 'standalone', // 启动画面
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    icons: [],
    // 这个对象用来生成manifest.json
    manifestOptions: {
      short_name: 'system',
      description: '一个测试的项目',
      // 这个值是生存在manifest文件中, 如果需要网页显示添加到主屏功能的话, 这个地方一定得设置对
      // 这个start_url因该和你得manifest文件存放得相对路径一致, 比如此项目的manifest文件存放在/admin/目录下
      // 结尾的 / 务必写上
      start_url: '/src/',
      background_color: '#fff',
      display: 'standalone'
    },
    //  此处使用的模式是 InjectManifest 这意味着我们可以通过serviceworker实现更多的功能
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'src/registerServiceWorker.js',
      swDest: 'service-worker.js' //  此处输出的service-worker.js文件位置, 会相对于 outputDir 目录进行存放
    }
  },
  configureWebpack: (config) => {
    // 配置别名
    config.resolve.alias = {
      ...(aliasConfigFn(resolve) || {})
    }
    console.log(config.resolve.alias, 222)
    config.plugins = [...config.plugins, ...commonPlugin, new webpack.ProvidePlugin({
      $: '@lm/shared/lib/src/utils'
    })]
  },
  css: {
    extract: !!isProd,
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              'Android 4.1',
              'iOS 7.1',
              'Chrome > 31',
              'ff > 31',
              'ie >= 8',
              'last 10 versions' // 所有主流浏览器最近10版本用
            ],
            grid: true
          }),
          pxtorem({
            rootValue: 100, // 以375的设计稿尺寸，通过设置根元素fontsize=100px=1rem作为标准。将rootValue设置为100，这样16px就会转化成0.16rem。方便计算
            propList: ['*'], // 表示转换所有属性中的px单位
            selectorBlackList: ['van-'] // 过滤掉.van-开头的class，不进行rem转换. Vant 组件内部已经处理好了尺寸。
          })
        ]
      },
      sass: {
        additionalData: '@use "@/styles/global.scss";'
      }
    }
  }
};
