const common = {
  tagNav: (state: any) => state.common.tagNav,
  currentRouteInfo: (state: any) => state.common.currentRouteInfo,
  fullScreenStatus: (state: any) => state.common.fullScreenStatus,
};

const getters = {
  ...common,
};

export default getters;
