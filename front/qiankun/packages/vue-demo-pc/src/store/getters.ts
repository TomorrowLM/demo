//可以认为是 store 的计算属性
const breadcrumbStore = {
  tagNav: (state: any) => state.breadcrumbStore.tagNav,
  currentRouteInfo: (state: any) => state.breadcrumbStore.currentRouteInfo,
};

const globalStaore = {
  userInfo: (state: any) => state.globalStore.userInfo,
};

const routeStore = {
  whiteRoutes: (state: any) => state.routeStore.whiteRoutes,
  flatAsyncRoutes: (state: any) => state.routeStore.flatAsyncRoutes,
  asyncRoutes: (state: any) => state.routeStore.asyncRoutes,
  commonMenu: (state: any) => state.routeStore.commonMenu,
  routes: (state: any) => state.routeStore.routes,
  registerRouteFresh: (state: any) => state.routeStore.registerRouteFresh,
};

const getters = {
  ...breadcrumbStore,
  ...globalStaore,
  ...routeStore,
};

export default getters;
