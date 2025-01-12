const path = require('path');

const { webpackBaseConfig, baseConfig, cssConfig } = require('@lm/shared/src/config/vue')
const autoprefixer = require('autoprefixer'); // 自动在样式中添加浏览器厂商前缀，避免手动处理样式兼容问题
const pxtorem = require('postcss-pxtorem');

const packageName = require('./package.json').name;
const resolve = (dir) => path.join(__dirname, dir);
console.log(process.env.NODE_ENV, process.env.VUE_APP_API_BASE_URL, 1);
const config = baseConfig(process.env)
module.exports = {
  ...config,
  configureWebpack: (config) => {
    // 配置别名
    webpackBaseConfig(process.env, config, resolve)
  },
  ...cssConfig(true)
  // css: {
  //   extract: !!isProd,
  //   sourceMap: false,
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         autoprefixer({
  //           overrideBrowserslist: [
  //             'Android 4.1',
  //             'iOS 7.1',
  //             'Chrome > 31',
  //             'ff > 31',
  //             'ie >= 8',
  //             'last 10 versions' // 所有主流浏览器最近10版本用
  //           ],
  //           grid: true
  //         }),
  //         pxtorem({
  //           rootValue: 100, // 以375的设计稿尺寸，通过设置根元素fontsize=100px=1rem作为标准。将rootValue设置为100，这样16px就会转化成0.16rem。方便计算
  //           propList: ['*'], // 表示转换所有属性中的px单位
  //           selectorBlackList: ['van-'] // 过滤掉.van-开头的class，不进行rem转换. Vant 组件内部已经处理好了尺寸。
  //         })
  //       ]
  //     },
  //     sass: {
  //       additionalData: '@use "@/styles/global.scss";'
  //     }
  //   }
  // }
};
