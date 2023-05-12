//可以认为是 store 的计算属性
const router = {
  tagNav: (state: any) => state.router.tagNav,
  currentRouteInfo: (state: any) => state.router.currentRouteInfo,
  wsData: (state: any) => state.router.wsData,
};

const user = {
  userInfo: (state: any) => state.user.userInfo,
  role: (state: any) => state.user.role,
  mockButton: (state: any) => state.user.mockButton,
};

const permission = {
  addRoutes: (state: any) => state.permission.addRoutes,
  routes: (state: any) => state.permission.routes,
};

const getters = {
  ...router,
  ...user,
  ...permission,
};

export default getters;
