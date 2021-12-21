//index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

let routes = []
const isProd = process.env.NODE_ENV === 'production'
const routerContext = require.context('./', true, /index\.js$/)

routerContext.keys().forEach(route => {
  // route就是路径
  // 如果是根目录的index不做处理
  if (route.startsWith('./index')) {
    return
  }
  const routerModule = routerContext(route)
  routes = [...routes, ...(routerModule.default || routerModule)]
  console.log(routes)
});

console.log(process.env.BASE_URL)

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  mode: 'history',
  base: isProd? '/wechatpub/' : process.env.BASE_URL,
  routes
})

export default router