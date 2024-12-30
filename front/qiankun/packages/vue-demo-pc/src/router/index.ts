/** 使用文件路径 */
import Vue from 'vue';

import VueRouter, { RouteConfig } from 'vue-router';

import store from '@/store';
Vue.use(VueRouter);
// 基础路由
const commonMenu: Array<RouteConfig> = [...store.getters.commonMenu];
const isProd = process.env.NODE_ENV === 'production';

const createRouter = () =>
  new VueRouter({
    mode: 'history',
    base: window.__POWERED_BY_QIANKUN__
      ? '/qiankun/vue2-pc/' // 配置子应用的路由根路径
      : isProd
      ? '/vue2-pc/' // 单一项目下的访问路径
      : '/',
    routes: commonMenu,
  });
const router: any = createRouter();
// 重置router的方法，需要在退出的时候重置router，否则下一个人登陆后也能访问上一个人的路由
export function resetRouter() {
  const newRouter = createRouter();
  // @ts-ignore
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
  console.log(to, from);
  // 设置当前页的title
  document.title = to.meta.title;
  console.log('router.beforeEach:', store.getters.routes, router.getRoutes(), store.getters.registerRouteFresh);
  if (to.path !== '/login' && !localStorage.getItem('token')) {
    next('/login');
    return;
  }

  // 如果首次或者刷新界面，next(...to, replace: true)会循环遍历路由，
  // 如果to找不到对应的路由那么他会再执行一次beforeEach((to, from, next))直到找到对应的路由，
  // 我们的问题在于页面刷新以后异步获取数据，直接执行next()感觉路由添加了但是在next()之后执行的，
  // 登录时，加载路由表
  if (store.getters.registerRouteFresh && to.path !== '/login') {
    store.commit('SET_PERMISSION', { type: 'registerRouteFresh', data: false });
    resetRouter();
    // 设置路由
    const asyncRoutes = await store.dispatch('generateRoutes', store.getters.role);
    console.log(asyncRoutes);
    asyncRoutes.forEach((item: RouteConfig) => {
      console.log('item', item);
      router.addRoute(item);
    });
    // 获取路由配置
    // console.log(router.getRoutes());
    // 通过next({...to, replace:true})解决刷新后路由失效的问题
    next({ ...to, replace: true });
  } else {
    next();
  }
  next();
});

export default router;
