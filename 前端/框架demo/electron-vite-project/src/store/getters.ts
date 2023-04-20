const common = {
  tagNav: (state: any) => state.common.tagNav,
  currentRouteInfo: (state: any) => state.common.currentRouteInfo,
  fullScreenStatus: (state: any) => state.common.fullScreenStatus,
};
const mainProcess = {
  createProject: (state: any) => state.mainProcess.createProject,
};

const getters = {
  ...common,
  ...mainProcess,
};

export default getters;
