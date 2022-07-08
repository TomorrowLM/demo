import HomeView from '@/views/HomeView.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const isProd = process.env.NODE_ENV === 'production';
const routerContext = require.context('./', true, /index\.js$/);
const whiteList = [];
let routes: any = [];

routerContext.keys().forEach((route) => {
  // route就是路径
  // 如果是根目录的index不做处理
  if (route.startsWith('./index')) {
    return;
  }
  const routerModule = routerContext(route);
  routes = [...routes, ...(routerModule.default || routerModule)];
  // console.log(routes);
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

const role = 'admin';
// const $import = require('./router/_import_' + process.env.NODE_ENV) // 引入获取组件的方法
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any) {
  const accessedRouters = Object.values(asyncRouterMap).filter((route: any) => {
    // if (!route.meta.role.includes(role)) {
    //   return false;
    // }
    if (route.component) {
      console.log(route.component);
      let a = `../views/${route.component}`;
      route.component = () => import(a); // 导入组件
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });
  console.log(accessedRouters);
  return accessedRouters;
}
// 添加这些路由至路由器
const mockRoute = {
  path: '/',
  name: 'home',
  meta: {
    title: '首页',
    //纯前端去做动态路由
    // roles: ['admin']
  },
  component: HomeView,
  children: [
    {
      path: 'PickupTask',
      name: 'PickupTask',
      meta: {
        title: 'PickupTask',
      },
      component: () => import('../views/Sd/PickupTask.vue'),
    },
    {
      path: '/access',
      component: () => import('../views/demo/Access.vue'),
      meta: { role: ['admin'] },
    },
  ],
};
router.addRoute(mockRoute);

/**
 * 全局全局前置守卫
 * to : 将要进入的目标路由对象
 * from : 即将离开的目标路由对象
 */
router.beforeEach((to: any, from, next) => {
  console.log(to);
  console.log(from);
  //设置当前页的title
  document.title = to.meta.title;
  if (to.path === '/login' && localStorage.getItem('token')) {
    console.log('1scaku');
    next('/');
  }
  next();
});

export default router;
