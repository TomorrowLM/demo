/** 使用文件路径 */
import Vue from 'vue';

import $lm from '@lm/shared/lib/src/utils';
import VueRouter, { RouteConfig } from 'vue-router';

import store from '@/store';
Vue.use(VueRouter); // 安装路由功能
const isProd = process.env.NODE_ENV === 'production';
// 基础路由
const whiteRoutes: Array<RouteConfig> = store.getters.whiteRoutes;
console.log(whiteRoutes, 'router:whiteRoutes');
const createRouter = () =>
  new VueRouter({
    mode: 'history',
    base: window.__POWERED_BY_QIANKUN__
      ? '/qiankun/vue2-pc/' // 配置子应用的路由根路径
      : isProd
      ? '/vue2-pc/' // 单一项目下的访问路径
      : '/',
    routes: whiteRoutes,
    // // 使用浏览器的回退或者前进时，重新返回时保留页面滚动位置，跳转页面的话，不触发。
    // scrollBehavior(to, from, savePosition) {
    //   if (savePosition) {
    //     return savePosition;
    //   } else {
    //     return { top: 0 };
    //   }
    // },
  });
const router: any = createRouter();

// 重置router，否则下一个人登陆后访问的是上一个人的路由信息
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

// push
// @ts-ignore
VueRouter.prototype.push = function push(location: any, onResolve: any, onReject: any) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  // @ts-ignore
  return originalPush.call(this, location).catch((err: any) => console.log(err));
};

// replace
// @ts-ignore
VueRouter.prototype.replace = function push(location: any, onResolve: any, onReject: any) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject);
  // @ts-ignore
  return originalReplace.call(this, location).catch((err: any) => err);
};
/**
 * 全局全局前置守卫
 * to : 将要进入的目标路由对象
 * from : 即将离开的目标路由对象
 */
router.beforeEach(async (to: any, from: any, next: any) => {
  console.log('router.beforeEach:', to, from, router.getRoutes(), store.getters.registerRouteFresh);
  // 设置当前页的title;
  document.title = to.meta.title || 'vue2-pc';
  if (to.path !== '/login' && !localStorage.getItem('token')) {
    // 如果没有登录，跳转到登录页
    next('/login');
  } else if (store.getters.registerRouteFresh && to.path !== '/login') {
    // 如果to找不到对应的路由那么他会再执行一次beforeEach((to, from, next))直到找到对应的路由，
    store.commit('SET_PERMISSION', { type: 'registerRouteFresh', data: false });
    // 获取路由
    const routes = await store.dispatch('generateRoutes');
    console.log('routes', routes);
    resetRouter(); // 重置路由信息
    routes.forEach((item: RouteConfig) => {
      router.addRoute(item);
    });
    // 获取路由配置
    console.log('getRoutes', router.getRoutes());
    // 解决刷新后路由失效的问题：因为开始时候路由表没有动态路由，需要指向确切的地址
    next(to.path);
    // next({ ...to, replace: true }); // 解决刷新后路由失效的问题
  } else {
    next();
  }
});

export default router;
