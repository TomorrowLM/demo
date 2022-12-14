import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const isProd = process.env.NODE_ENV === 'production';
const routerContext = require.context('./', true, /index\.js$/);
//静态路由
export let routes: any = [];

routerContext.keys().forEach((route) => {
  // route就是路径
  // 如果是根目录的index不做处理
  if (route.startsWith('./index')) {
    return;
  }
  const routerModule = routerContext(route);
  routes = [...routes, ...(routerModule.default || routerModule)];
});

// 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  mode: 'history',
  base: isProd ? '/vue-demo/' : process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
      };
    }
  },
});

let registerRouteFresh = true;
/**
 * 全局全局前置守卫
 * to : 将要进入的目标路由对象
 * from : 即将离开的目标路由对象
 */
router.beforeEach(async (to: any, from, next) => {
  console.log(to);
  // console.log(from);
  //设置当前页的title
  document.title = to.meta.title;
  if (to.path === '/login' && localStorage.getItem('token')) {
    next('/');
  }
  console.log(registerRouteFresh);
  //如果首次或者刷新界面，next(...to, replace: true)会循环遍历路由，
  //如果to找不到对应的路由那么他会再执行一次beforeEach((to, from, next))直到找到对应的路由，
  //我们的问题在于页面刷新以后异步获取数据，直接执行next()感觉路由添加了但是在next()之后执行的，
  //所以我们没法导航到相应的界面。这里使用变量registerRouteFresh变量做记录，直到找到相应的路由以后，把值设置为false然后走else执行next(),整个流程就走完了，路由也就添加完了。
  if (registerRouteFresh) {
    //设置路由
    const accessRoutes = await store.dispatch('generateRoutes', store.getters.role);
    let errorPage = {
      path: '*',
      name: '404',
      component: () => import('../views/404.vue'),
    };
    // 将404添加进去
    // 现在才添加的原因是：作为一级路由，当刷新，动态路由还未加载，路由就已经做了匹配，找不到就跳到了404
    router.addRoute({ ...errorPage });
    accessRoutes.forEach((item: RouteConfig) => {
      router.addRoute(item);
    });
    //获取路由配置
    console.log(router.getRoutes());
    //通过next({...to, replace})解决刷新后路由失效的问题
    next({ ...to, replace: true });
    registerRouteFresh = false;
  } else {
    next();
  }
  next();
});

export default router;
