/**使用文件路径 */
// import Vue from 'vue';
// import VueRouter, { RouteConfig } from 'vue-router';
// import store from '@/store';

// Vue.use(VueRouter);

// const isProd = process.env.NODE_ENV === 'production';
// const routerContext = require.context('./', true, /index\.js$/);
// //静态路由
// export let routes: any = [];

// routerContext.keys().forEach((route) => {
//   // route就是路径
//   // 如果是根目录的index不做处理
//   if (route.startsWith('./index')) {
//     return;
//   }
//   const routerModule = routerContext(route);
//   routes = [...routes, ...(routerModule.default || routerModule)];
// });

// // 创建 router 实例，然后传 `routes` 配置
// const router = new VueRouter({
//   mode: 'history',
//   base: isProd ? '/vue-demo/' : process.env.BASE_URL,
//   routes,
// });

import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '@/store';
Vue.use(VueRouter);
//公共菜单
export const commonMenu = [
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/common/404.vue'),
    meta: { sidebar: false },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { sidebar: true },
  },
];

/**本地写死 */
// export const stellBilletMenu = [
//   {
//     meta: { sidebar: true },
//     path: '/',
//     name: '主页',
//     menuName: '主页',
//     component: () => import('@/views/dashboard/index.vue'),
//   },
// ];

/**后端返回路由 */
store.dispatch('generateRoutes', store.getters.role);
export const stellBilletMenu = store.getters.routes;
export const routeList = [...stellBilletMenu, ...commonMenu];

const routes: Array<RouteConfig> = [...stellBilletMenu, ...commonMenu];
const isProd = process.env.NODE_ENV === 'production';
console.log(window.__POWERED_BY_QIANKUN__);
const router = new VueRouter({
  mode: 'history',
  base: window.__POWERED_BY_QIANKUN__
    ? '/qiankun/vue2-pc/' //配置子应用的路由根路径
    : isProd
    ? '/vue2-pc/' //单一项目下的访问路径
    : '/',
  routes,
});

let registerRouteFresh = true;
/**
 * 全局全局前置守卫
 * to : 将要进入的目标路由对象
 * from : 即将离开的目标路由对象
 */
// router.beforeEach(async (to: any, from, next) => {
//   console.log(to);
//   // console.log(from);
//   //设置当前页的title
//   document.title = to.meta.title;
//   // if (to.path === '/login' && localStorage.getItem('token')) {
//   //   next('/');
//   // }
//   //如果首次或者刷新界面，next(...to, replace: true)会循环遍历路由，
//   //如果to找不到对应的路由那么他会再执行一次beforeEach((to, from, next))直到找到对应的路由，
//   //我们的问题在于页面刷新以后异步获取数据，直接执行next()感觉路由添加了但是在next()之后执行的，
//   //所以我们没法导航到相应的界面。这里使用变量registerRouteFresh变量做记录，直到找到相应的路由以后，把值设置为false然后走else执行next(),整个流程就走完了，路由也就添加完了。
//   // if (registerRouteFresh) {
//   //   //设置路由
//   //   const accessRoutes = await store.dispatch('generateRoutes', store.getters.role);
//   //   // let errorPage = {
//   //   //   path: '*',
//   //   //   name: '404',
//   //   //   component: () => import('../views/404.vue'),
//   //   // };
//   //   // 将404添加进去
//   //   // 现在才添加的原因是：作为一级路由，当刷新，动态路由还未加载，路由就已经做了匹配，找不到就跳到了404
//   //   // router.addRoute({ ...errorPage });
//   //   accessRoutes.forEach((item: RouteConfig) => {
//   //     router.addRoute(item);
//   //   });
//   //   //获取路由配置
//   //   console.log(router.getRoutes());
//   //   //通过next({...to, replace})解决刷新后路由失效的问题
//   //   next({ ...to, replace: true });
//   //   registerRouteFresh = false;
//   // } else {
//   //   next();
//   // }
//   next();
// });

export default router;
