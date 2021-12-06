const path = require("path");
const resolve = dir => path.join(__dirname, dir);
module.exports = {
    // publicPath: process.env.NODE_ENV === 'production'
    //     ? '/vue-demo/'
    //     : '/',
    pwa: {
        name: "vue-demo",
        short_name: "vue-demo",
        themeColor: "#2F54EB", //  （index.html文件中也要设置）主题颜色，强烈建议和ui主题颜色保持一致，看起来更有原生app的感觉
        msTileColor: "#fff",
        skipWaiting: true,
        clientsClaim: true,
        display: "standalone",  // 启动画面
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
            display: "standalone"
        },
        //  此处使用的模式是 InjectManifest 这意味着我们可以通过serviceworker实现更多的功能
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: "src/registerServiceWorker.js",
            swDest: "service-worker.js"   //  此处输出的service-worker.js文件位置, 会相对于 outputDir 目录进行存放
        }
    },
    //
    chainWebpack: config => {
        config.resolve.alias
            .set("vue$", "vue/dist/vue.esm.js")
            .set("@", resolve("src"))
            .set("@assets", resolve("src/assets"))
            .set("@components", resolve("src/components"))
            .set("@views", resolve("src/views"))
            .set("@router", resolve("src/router"))
            .set("@store", resolve("src/store"));
    },
    configureWebpack: {
        devServer: {
            contentBase: './src',//项目基本访问目录
            host: 'localhost',//服务器ip地址
            port: 8088,//端口
            hot: true,//模块热替换
            hotOnly: true,//只有热更新不会刷新页面
        }
    },
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        //  extract: true,
        // 开启 CSS source maps?
        // sourceMap: true,
        // // 启用 CSS modules for all css / pre-processor files.
        // modules: false
    }
}