/* eslint-disable no-unused-vars */
/**
 * 向后端请求用户信息
 */
import {
  userInfoApi,
} from '@/api'
import Vue from 'vue'

const globalStore = {
  state: Vue.observable({
    userInfo: {},
  }),
  //更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  mutations: {
    SET_STATE: (state, data) => {
      state[data.type] = data.data
    },
  },
  //Action 提交的是 mutation，而不是直接变更状态。Action 可以包含任意异步操作。
  actions: {
    async GetUserCoreInfo({ commit, rootState }) {
      const result = await userInfoApi();
      commit('SET_STATE', { type: 'userInfo', data: result.data });
    },
  }
}

export default globalStore
