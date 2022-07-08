// import Vue from 'vue'
// import VueRouter, { RouteConfig } from 'vue-router'
// import HomeView from '@/views/HomeView.vue'
// import PickupTask from '@/views/Sd/PickupTask.vue'

// Vue.use(VueRouter)

// const routes: Array<RouteConfig> = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView,
//     children: [
//       {
//         path: '/PickupTask',
//         name: 'PickupTask',
//         component: PickupTask
//       }
//     ]
//   }
// ]

// const router = new VueRouter({
//   mode: 'history',
//   routes
// })

// export default router

//index.js
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

let routes: any = [];
const isProd = process.env.NODE_ENV === "production";
const routerContext = require.context("./", true, /index\.js$/);

routerContext.keys().forEach((route) => {
  // route就是路径
  // 如果是根目录的index不做处理
  if (route.startsWith("./index")) {
    return;
  }
  const routerModule = routerContext(route);
  routes = [...routes, ...(routerModule.default || routerModule)];
  // console.log(routes)
});

// console.log(process.env.BASE_URL)

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  mode: "history",
  base: isProd ? "/vue-demo/" : process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
      };
    }
  },
});

// router.beforeEach((to, from, next) => {   //全局全局前置守卫
//   //to : 将要进入的目标路由对象
//   //from : 即将离开的目标路由对象
//   //执行跳转的下一步钩子
//   console.log(to)
//   console.log(from)
//   if (to.name != 'login') { //如果不是登录页面
//     if (window.localStorage.getItem('token')) next()   //已登录就执行跳转
//     else next({ name: 'login' })   //否则跳转到登录页面
//   } else { //如果是登录页面
//     if (window.localStorage.getItem('token')) next({ name: '/' }) //已登录就跳转到首页
//     else next()  //否则正常进入登录页面
//   }
// })
// //获取原型对象上的push函数
// const originalPush = router.prototype.push
// //修改原型对象中的push方法
// router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
export default router;
