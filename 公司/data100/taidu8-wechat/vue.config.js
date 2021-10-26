const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const path = require('path')
const webpack = require('webpack')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const taidu8Theme = resolve("src/assets/styles/theme.less")
const taidu8Mixin = resolve('src/assets/styles/mixin.less')

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js'
  ]
}

// 将配置抽离出来，形成公共配置，直接引用
const productionGzipExtensions = ["js", "css"]

const commonPlugin = [
  // 扩展环境变量
  // new webpack.DefinePlugin({
  //   BASE_URL: JSON.stringify(process.env.BASE_URL)
  // })
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  // 自动加载模块，而不必到处 import 或 require ，在这里加载模块之后，组件内部就不用inport引入了
  new webpack.ProvidePlugin({
    $_clone: 'lodash.clonedeep',
    $_moment: 'moment',
  }),
  // HTML文件的配置插件
  // new HtmlWebpackPlugin({
  //   filename: "index.html",
  //   template: "./public/index.html",
  //   title: "拼任务",
  //   inject: true,
  //   url: process.env.BASE_URL,
  //   minify: {
  //     removeComments: true, // 移除HTML中的注释
  //     collapseWhitespace: true, // 删除空白符与换行符
  //     minifyCSS: true // 压缩内联css
  //   }
  // })
]

const prodCommonPlugin = [
  // new swPlugin('oem' + newversion),
  new WorkboxPlugin.GenerateSW({
    cacheId: 'webpack-pwa',
    skipWaiting: true, // 跳过waiting状态
    clientsClaim: true, // 通知让新的sw立即在页面上取得控制权
    cleanupOutdatedCaches: true, // 删除过时、老版本的缓存
    include: [
    ],
    // 缓存规则，可用正则匹配请求，进行缓存
    // 这里将js、css、还有图片资源分开缓存，可以区分缓存时间(虽然这里没做区分。。)
    runtimeCaching: [
      {
        urlPattern: /.*\.js$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'rys-js',
          expiration: {
            maxEntries: 30,  // 最多缓存20个，超过的按照LRU原则删除
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: /.*css.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'rys-css',
          expiration: {
            maxEntries: 30,  // 最多缓存30个，超过的按照LRU原则删除
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      }
    ]
  }),
  new CompressionWebpackPlugin({
    filename: "[path].gz[query]",
    algorithm: "gzip",
    test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"), // 匹配文件名
    threshold: 10240, // 对10K以上的数据进行压缩
    minRatio: 0.8,
    deleteOriginalAssets: false // 是否删除源文件
  }),
  // 压缩代码，去除 生产环境的 console 和 debugger
  new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        dead_code: true,
        // warnings: false,
        drop_debugger: true,
        drop_console: true,
      },
    },
    sourceMap: false,
    parallel: true,
  })
]

const vueConfig = {
  publicPath: isProd && process.env.VUE_APP_PREVIEW !== 'true' ? 'https://static.pinrenwu.cn/wechatpub' : '/wechatpub',
  productionSourceMap: isProd ? false : true,
  css: {
    extract: isProd ? true : false,
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*'],
            selectorBlackList: ['van']
          })
        ]
      },
      less: {
        // 若使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            hack: `true; @import "${taidu8Theme}";`,
          }
        },
      }
    }
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    },
    manifestOptions: {
      icons: []
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/registerServiceWorker.js',
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [taidu8Mixin]
    }
  },
  configureWebpack: (config) => {
    // 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打点
    config.performance = {
      hints: 'warning',
      // 入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js');
      }
    }
    // 针对不同环境进行 配置
    if(isProd) {
      // 配置插件
      return {
        // 配置插件
        plugins: [
          // 调用外部配置
          ...commonPlugin,
          ...prodCommonPlugin
        ],
        externals: assetsCDN.externals
      }
    } else {
      return {
        plugins: commonPlugin,
        externals: {}
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
    config.plugin('html').tap(args => {
      args[0].title= '拼任务'
      return args
    })
    config.entry('main').add('babel-polyfill'),
    config.output.filename('[name].[hash].js').end(),
    config.output.chunkFilename('js/[id].[hash].js').end()
    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },
}

module.exports = vueConfig