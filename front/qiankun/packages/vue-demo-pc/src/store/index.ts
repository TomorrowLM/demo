import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';

import breadcrumbStore from './modules/breadcrumbStore';
import globalStore from './modules/globalStore';
import routeStore from './modules/routeStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    globalStore,
    routeStore,
    breadcrumbStore,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
});
