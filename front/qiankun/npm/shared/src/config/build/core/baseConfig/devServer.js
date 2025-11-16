const path = require('path');
let dir = process.cwd();
module.exports = {
  'vue-demo-pc': {
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
}