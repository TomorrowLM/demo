import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';

import router from './modules/router';
import user from './modules/user';
import permission from './modules/permission';


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    router,
    user,
    permission,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
});
