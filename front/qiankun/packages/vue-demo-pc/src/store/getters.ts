//可以认为是 store 的计算属性
const router = {
  tagNav: (state: any) => state.router.tagNav,
  currentRouteInfo: (state: any) => state.router.currentRouteInfo,
};

const user = {
  userInfo: (state: any) => state.user.userInfo,
  role: (state: any) => state.user.role,
};

const permission = {
  whiteRoutes: (state: any) => state.permission.whiteRoutes,
  flatAsyncRoutes: (state: any) => state.permission.flatAsyncRoutes,
  asyncRoutes: (state: any) => state.permission.asyncRoutes,
  commonMenu: (state: any) => state.permission.commonMenu,
  routes: (state: any) => state.permission.routes,
  registerRouteFresh: (state: any) => state.permission.registerRouteFresh,
};

const getters = {
  ...router,
  ...user,
  ...permission,
};

export default getters;
