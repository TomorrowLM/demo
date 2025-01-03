// import $utils from '../utils/index';
// const $utils = require('../utils/index');
const path = require("path");

const webpack = require("webpack");

const resolveFn = (dir) => path.join(__dirname, dir);
const $ = require(resolveFn("../utils"));
const commonPlugin = [
  // 自动加载模块，而不必到处 import 或 require ，在这里加载模块之后，组件内部就不用inport引入了
];

const assetsCDN = {
  // webpack build externals
  // externals: {
  //   vue: 'Vue',
  //   'vue-router': 'VueRouter',
  //   vuex: 'Vuex',
  //   axios: 'axios'
  // },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js'
  ]
};
const pwa = {
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
}

const aliasConfigFn = (resolve) => {
  return {
    '@': resolve('./src'),
    '@shared': resolveFn('../'),
    '@components': resolve('./src/components')
    // 'assets': path.resolve(__dirname, './src/assets'),
    // 'common': path.resolve(__dirname, './src/common'),
    // 'network': path.resolve(__dirname, './src/network'),
    // 'configs': path.resolve(__dirname, './src/configs'),
    // 'views': path.resolve(__dirname, './src/views'),
    // 'plugins': path.resolve(__dirname, './src/plugins'),
    //   assets: resolve('src/assets'),
    //   public: resolve('public')
  }
}

const webpackBaseConfig = (config) => {
};

module.exports = {
  commonPlugin,
  aliasConfigFn,
  webpackBaseConfig
};
