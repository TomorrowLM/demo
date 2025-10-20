// 注意：这些依赖应该在使用时动态引入，而不是在模块级别引入
// const path = require("path");
// const autoprefixer = require('autoprefixer');
// const pxtorem = require('postcss-pxtorem');
// const webpack = require("webpack");

const resolveFn = (dir: string) => {
  // 在实际使用时需要动态引入path模块
  const path = require("path");
  return path.join(__dirname, dir);
};
let isProd = false;
const commonPlugin = () => {
  // 动态引入webpack
  const webpack = require("webpack");
  return [
    // 自动加载模块，而不必到处 import 或 require ，在这里加载模块之后，组件内部就不用inport引入了
    new webpack.ProvidePlugin({
      $lm: '@lm/shared/lib/src/utils',
      // $lm: '@lm/shared/src/utils',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ];
};
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
const devServerConfig = (BASE_URL, API_HOST, port) => {
  console.log('devServerConfig', BASE_URL, API_HOST, port)
  return {
    devServer: {
      // contentBase: './src',//项目基本访问目录
      // host: 'localhost', // 服务器ip地址
      port,
      open: true, // 配置自动启动浏览器
      hot: true, // 模块热替换
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        [BASE_URL]: {
          target: API_HOST,
          changeOrigin: true,
          secure: false,
          xfwd: false,
          pathRewrite: { [BASE_URL]: '/' } // 重点：重写资源访问路径，避免转发请求 404问题
        }
      }
    }
  }
}
const cssConfig = (isMobile: boolean = false) => {
  return {
    css: {
      extract: {
        ignoreOrder: true // 解决组件的引入必须先后顺序一致
      }, // 是否使用css分离插件 ExtractTextPlugin
      sourceMap: false,
      loaderOptions: {
        sass: {
          additionalData: '@import "@/styles/index.scss";' // 注入全局样式
          // implementation: require('sass'), // 使用 Dart Sass
        }
        // postcss: {
        //   plugins: [
        //     autoprefixer({
        //       overrideBrowserslist: [
        //         'Android 4.1',
        //         'iOS 7.1',
        //         'Chrome > 31',
        //         'ff > 31',
        //         'ie >= 8',
        //         'last 10 versions' // 所有主流浏览器最近10版本用
        //       ],
        //       grid: true
        //     }),
        //     isMobile && pxtorem({
        //       rootValue: 100, // 以375的设计稿尺寸，通过设置根元素fontsize=100px=1rem作为标准。将rootValue设置为100，这样16px就会转化成0.16rem。方便计算
        //       propList: ['*'], // 表示转换所有属性中的px单位
        //       selectorBlackList: ['van-'] // 过滤掉.van-开头的class，不进行rem转换. Vant 组件内部已经处理好了尺寸。
        //     })
        //   ]
        // }
      }
    }
    // css: {
    //   extract: !!isProd,
    //   sourceMap: false,
    //   loaderOptions: {
    //     sass: {
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
  }
}
const aliasConfigFn = (resolve: (path: string) => string) => {
  return {
    '@': resolve('./src'),
    '@shared': resolveFn('..'),
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
const webpackBaseConfig = (processVars: any, config: any, resolve: (path: string) => string) => {
  // 配置别名
  config.resolve.alias = {
    ...(aliasConfigFn(resolve) || {})
  }
  // config.plugins.push(...commonPlugin())
  config.plugins = [...config.plugins || [], ...commonPlugin()]
  if (isProd) {
    // 在生产模式下使用 chunkhash 或 contenthash
    config.output.filename = 'js/[name].[contenthash].js';
    config.output.chunkFilename = 'js/[name].[contenthash].js';
  } else {
    // 在开发模式下使用 hash
    config.output.filename = 'js/[name].[hash].js';
    config.output.chunkFilename = 'js/[name].[hash].js';
  }
};
/**
 * 获取公共路径
 *
 * @param {boolean} isProd - 是否为生产环境
 * @param {boolean} isQiankun - 是否为微前端项目
 * @param {string} qiankunPath - 微前端路径
 * @param {string} buildPath - 构建路径
 * @returns {string} 公共路径
 */
const publicPath = (isProd: boolean, isQiankun: boolean, qiankunPath?: string, buildPath?: string) => {
  return isProd ? (isQiankun ? qiankunPath || '/' : buildPath || '/') : '/'
}
const baseConfig = (processVars: any) => {
  const { NODE_ENV, VUE_APP_PORT, VUE_APP_PROXY_API, VUE_APP_Build_Qiankun_Path, VUE_APP_Build_Path, VUE_APP_OUTPUTDIR, VUE_APP_API_HOST } = processVars;
  isProd = process.env.NODE_ENV === 'production'
  const isQiankun = process.env.VUE_APP_IS_QIANKUN === 'true';
  console.log('baseConfig', VUE_APP_PROXY_API, VUE_APP_API_HOST, NODE_ENV, VUE_APP_Build_Qiankun_Path, VUE_APP_Build_Path)
  const publicPath = isProd ? isQiankun ? VUE_APP_Build_Qiankun_Path : VUE_APP_Build_Path : isQiankun ? `http://localhost:${VUE_APP_PORT}` : '/'
  return {
    publicPath,
    // 打包文件输出路径，即打包到哪里
    outputDir: VUE_APP_OUTPUTDIR || 'dist',
    // assetsDir: 'assets',//静态资源目录(js,css,img,fonts)这些文件都可以写里面
    // lintOnSave: true, // boolean | 'warning' | 'default' | 'error'
    // transpileDependencies: [],
    productionSourceMap: !isProd, // 生产环境是否生成 sourceMap 文件
    ...devServerConfig(VUE_APP_PROXY_API, VUE_APP_API_HOST, VUE_APP_PORT),
    ...cssConfig()
  }
}
// export default {
//   commonPlugin,
//   aliasConfigFn,
//   webpackBaseConfig,
//   baseConfig,
//   cssConfig
// };

module.exports = {
  commonPlugin,
  aliasConfigFn,
  webpackBaseConfig,
  baseConfig,
  cssConfig
};