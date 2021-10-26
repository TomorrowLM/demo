import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

import user from './modules/user'
import market from './modules/market'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    market
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
