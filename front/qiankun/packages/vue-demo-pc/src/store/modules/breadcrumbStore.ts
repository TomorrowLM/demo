/* eslint-disable no-unused-vars */
/**
 * 向后端请求用户信息
 */
// import { userInfo } from '@/api';
interface TagNavProps {
  name: string;
  meta: {
    menuName: string;
  };
  path: string;
}

const breadcrumbStore = {
  state: {
    tagNav: [],
  },
  // 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  mutations: {
    setTagNav(state: any, nav: any) {
      console.log('nav', nav, state.tagNav);
      if (!state.tagNav.some((val: TagNavProps) => val?.path === nav.path)) {
        state.tagNav.push(nav);
      }
      console.log('tagNav', state.tagNav);
    },
    deleteTag(state: any, tagIndex: any) {
      let currentRoute = {};
      if (tagIndex - 1 >= 0) {
        currentRoute = state.tagNav[tagIndex - 1];
      } else {
        currentRoute = state.tagNav[tagIndex + 1];
      }
      state.tagNav.splice(tagIndex, 1);
      // window.sessionStorage.setItem('currentRouteInfo', JSON.stringify(currentRoute));
      // state.currentRouteInfo = JSON.parse(window.sessionStorage.getItem('currentRouteInfo') as any);
    },
  },
  actions: {},
};

export default breadcrumbStore;
