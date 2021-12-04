// module.exports = {
//     pwa: {
//       name: "项目名称",
//       themeColor: "#2F54EB",
//       msTileColor: "#fff",
//       appleMobileWebAppCapable: "yes",
//       appleMobileWebAppStatusBarStyle: "black",
//       //这个对象用来生成manifest.json
//       manifestOptions: {
//         short_name: "system",
//         // https://github.com/jcalixte/vue-pwa-asset-generator
//         // 可以通过上面这个项目生成icons包, 很方便
//         description: "一个测试的项目",
//         // 这个值是生存在manifest文件中, 如果需要网页显示添加到主屏功能的话, 这个地方一定得设置对
//         // 这个start_url因该和你得manifest文件存放得相对路径一致, 比如此项目的manifest文件存放在/admin/目录下
//         // 结尾的 / 务必写上
//         start_url:"/src/",
//         background_color: "#fff",
//         display: "standalone"
//       },
//       //  此处使用的模式是 InjectManifest 这意味着我们可以通过serviceworker实现更多的功能
//       workboxPluginMode: "InjectManifest",
//       workboxOptions: {
//         // swSrc is required in InjectManifest mode.
//         swSrc: "src/service-worker.js",
//         swDest: "service-worker.js"   //  此处输出的service-worker.js文件位置, 会相对于 outputDir 目录进行存放
//       }
//     }
// }