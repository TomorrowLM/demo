module.exports = function devServer(GLOBAL_INFO) {
  const devServerTarget = GLOBAL_INFO.ENV_CONFIG.APP_BASE_API;
  const APP_NAME = GLOBAL_INFO.APP_INFO.APP_NAME;
  const { APP_PORT, APP_PROXY_API } = GLOBAL_INFO.ENV_CONFIG;
  console.log('devServer', APP_NAME, APP_PORT, devServerTarget);
  return {
    'base-react-app': {
      /**
       * 解决使用history模式，SPA页面在路由跳转之后，访问不到后端资源，返回404错误
       */
      historyApiFallback: true,
      /**
       *  配置dev-server命令参数的第二种形式: "dev": "webpack-dev-server --open --port 3000 --contentBase src --hot"
       */
      open: true, //自动打开浏览器
      port: APP_PORT,
      static: "./public", //指定静态资源目录
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: [
        {
          context: ['/vue2-mobile/api', '/vue2-pc/api', '/vue3/api', '/react-app/api'],
          target: devServerTarget,
          changeOrigin: true,
          secure: false,
          xfwd: false,
          pathRewrite: { '/vue2-pc/api': '/', '/vue2-mobile/api': '/', '/vue3/api': '/', '/react-app/api': '/' }  //重点：重写资源访问路径，避免转发请求 404问题
        },
      ]
    },
    'vue-demo-pc': {
      // contentBase: './src',//项目基本访问目录
      host: 'localhost', //服务器ip地址
      port: APP_PORT,
      open: true, // 配置自动启动浏览器
      hot: true, //模块热替换
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      // public: 'http://192.168.10.36:8088',
      proxy: {
        '/vue2-pc/api': {
          // target: 'http://lm-web.top:3600/',
          target: "http://localhost:3600",
          changeOrigin: true,
          secure: false,
          xfwd: false,
          pathRewrite: { '/vue2-pc/api': '' }  //重点：重写资源访问路径，避免转发请求 404问题
        },
      },
    },
    'vue2-mobile-app': {
      // contentBase: './src',//项目基本访问目录
      host: 'localhost', //服务器ip地址
      port: APP_PORT,
      open: true, // 配置自动启动浏览器
      hot: true, //模块热替换
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      // public: 'http://192.168.10.36:8088',
      proxy: {
        [APP_PROXY_API]: {
          // target: 'http://lm-web.top:3600/',
          target: "http://localhost:3600",
          changeOrigin: true,
          secure: false,
          xfwd: false,
          pathRewrite: { [APP_PROXY_API]: '' }  //重点：重写资源访问路径，避免转发请求 404问题
        },
      },
    },
    'react-app': {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
      historyApiFallback: true,
      //配置dev-server命令参数的第二种形式
      // "dev": "webpack-dev-server --open --port 3000 --contentBase src --hot"
      open: true, //自动打开浏览器
      port: 8004,
      hot: true,
      proxy: {
        [APP_PROXY_API]: {
          target: devServerTarget,
          changeOrigin: true,
          secure: false,
          xfwd: false,
          pathRewrite: { [APP_PROXY_API]: '' }
        }
      },
    }
  }[APP_NAME]
}