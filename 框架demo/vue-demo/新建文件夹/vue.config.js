const { defineConfig } = require('@vue/cli-service')
const path = require('path')
// const pxtorem = require('postcss-pxtorem')
const autoprefixer = require('autoprefixer')// 自动在样式中添加浏览器厂商前缀，避免手动处理样式兼容问题
const resolve = dir => path.join(__dirname, dir)
const isProd = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-demo/'
    : '/',
  //打包文件输出路径，即打包到哪里
  outputDir: 'dist',
  // assetsDir: 'assets',//静态资源目录(js,css,img,fonts)这些文件都可以写里面
  lintOnSave: true,//boolean | 'warning' | 'default' | 'error'
  transpileDependencies: true,
  productionSourceMap: !isProd, // 生产环境是否生成 sourceMap 文件
  devServer: {
    host: 'localhost',//服务器ip地址
    open: true,
    port: 8088,
    hot: true,//模块热替换
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    // public: 'http://192.168.10.36:8088',
    proxy: {
      '/dev': {
        target: 'http://tomorrowlm.xyz:3000',
        changeOrigin: true,
        secure: false,
        xfwd: false,
      }
    },
  },
  configureWebpack: {
    // resolve: {
    //   alias: {
    //     // 此处配置别名和实际对应路径的映射
    //     '@': path.resolve(__dirname, './src')
    //   }
    // }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('public', resolve('public'));

    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      console.log(config);
    }
  },
  css: {
    extract: Boolean(isProd),
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
      less: {
        // javascriptEnabled: true
      }
    }
  },
})
