import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';

import user from './modules/user';
import permisssion from './modules/permission';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    permisssion,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
});
