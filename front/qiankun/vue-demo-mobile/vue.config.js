const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
const pxtorem = require("postcss-pxtorem");
const autoprefixer = require("autoprefixer"); //自动在样式中添加浏览器厂商前缀，避免手动处理样式兼容问题
const webpack = require("webpack");
const packageName = require("./package.json").name;
const name = require("./package.json").name;
const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development" ? true : false;
const commonPlugin = [
  // 扩展环境变量
  // new webpack.DefinePlugin({
  //   BASE_URL: JSON.stringify(process.env.BASE_URL)
  // })
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  // 自动加载模块，而不必到处 import 或 require ，在这里加载模块之后，组件内部就不用inport引入了
  new webpack.ProvidePlugin({
    $_clone: "lodash.clonedeep",
    $_moment: "moment",
  }),
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
    "//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js",
    "//cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js",
    "//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js",
    "//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js",
  ],
};
console.log(process.env.NODE_ENV,process.env.VUE_APP_API_BASE_URL);
module.exports = {
  publicPath: isProd ? "/qiankun/child/vue2-mobile/" : "/",
  //打包文件输出路径，即打包到哪里
  outputDir: "dist",
  // assetsDir: 'assets',//静态资源目录(js,css,img,fonts)这些文件都可以写里面
  lintOnSave: true, //boolean | 'warning' | 'default' | 'error'
  productionSourceMap: isProd ? false : true, // 生产环境是否生成 sourceMap 文件
  devServer: {
    disableHostCheck: true, //webpack4.0 开启热更新
    contentBase: "./src", //项目基本访问目录
    // host: 'localhost',//服务器ip地址
    open: true,
    port: 8001,
    hot: true, //模块热替换
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    //这个api是webpack原生的api，主要是说明监控变化是否开启轮询。
    //通过开启轮询，来验证前后两次代码是否有变化。
    //但是，需要说明的是，这个轮询肯定是会占据消耗资源的。慎重使用吧。
    // watchOptions: {
    //   poll: 1000, // 每隔1s轮询一次
    // },
    proxy: {
      "/api": {
        // target: process.env.VUE_APP_API_BASE_URL,
        target: 'http://localhost:3600',
        changeOrigin: true,
        secure: false,
        xfwd: false,
        pathRewrite: { '/api': '' }  //重点：重写资源访问路径，避免转发请求 404问题
      }
    },
  },
  pwa: {
    name: "vue-demo",
    short_name: "vue-demo",
    themeColor: "#2F54EB", //  （index.html文件中也要设置）主题颜色，强烈建议和ui主题颜色保持一致，看起来更有原生app的感觉
    msTileColor: "#fff",
    skipWaiting: true,
    clientsClaim: true,
    display: "standalone", // 启动画面
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    icons: [],
    //这个对象用来生成manifest.json
    manifestOptions: {
      short_name: "system",
      description: "一个测试的项目",
      // 这个值是生存在manifest文件中, 如果需要网页显示添加到主屏功能的话, 这个地方一定得设置对
      // 这个start_url因该和你得manifest文件存放得相对路径一致, 比如此项目的manifest文件存放在/admin/目录下
      // 结尾的 / 务必写上
      start_url: "/src/",
      background_color: "#fff",
      display: "standalone",
    },
    //  此处使用的模式是 InjectManifest 这意味着我们可以通过serviceworker实现更多的功能
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "src/registerServiceWorker.js",
      swDest: "service-worker.js", //  此处输出的service-worker.js文件位置, 会相对于 outputDir 目录进行存放
    },
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`, // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    },
  },
  // configureWebpack: (config) => {
  //   // 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打点
  //   config.performance = {
  //     hints: "warning",
  //     // 入口起点的最大体积 整数类型（以字节为单位）
  //     maxEntrypointSize: 50000000,
  //     // 生成文件的最大体积 整数类型（以字节为单位 300k）
  //     maxAssetSize: 30000000,
  //     // 只给出 js 文件的性能提示
  //     assetFilter: function (assetFilename) {
  //       return assetFilename.endsWith(".js");
  //     },
  //   };
  //   // config.output = {
  //   //   library: `${name}-[name]`,
  //   //   libraryTarget: "umd", // 把微应用打包成 umd 库格式
  //   //   jsonpFunction: `webpackJsonp_${name}`, // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
  //   // };
  //   // 针对不同环境进行 配置
  //   if (isProd) {
  //     // 配置插件
  //     return {
  //       // 配置插件
  //       plugins: [
  //         // 调用外部配置
  //         ...commonPlugin,
  //       ],
  //       externals: assetsCDN.externals,
  //     };
  //   } else {
  //     return {
  //       plugins: commonPlugin,
  //       externals: {},
  //     };
  //   }
  // },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("public", resolve("public"));

    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
    } else {
      // console.log(config);
    }
  },
  css: {
    extract: isProd ? true : false,
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              "Android 4.1",
              "iOS 7.1",
              "Chrome > 31",
              "ff > 31",
              "ie >= 8",
              "last 10 versions", // 所有主流浏览器最近10版本用
            ],
            grid: true,
          }),
          pxtorem({
            // 之所以设为37.5，是为了引用像vant、mint-ui这样的第三方UI框架，
            // 因为第三方框架没有兼容rem，用的是px单位，将rootValue的值设置为设计图宽度（这里为750px）75的一半，即可以1:1还原vant、mint-ui的组件，否则会样式会有变化，例如按钮会变小。
            rootValue: 37.5, //根元素的值，即1rem的值.rem=设计稿元素尺寸/rootValue
            propList: ["*"],
            selectorBlackList: ["van"], // 过滤掉.van-开头的class，不进行rem转换
          }),
        ],
      },
      less: {
        // 若使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          // strictMath: true,
        },
      },
    },
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/global.less")],
    },
  },
};
