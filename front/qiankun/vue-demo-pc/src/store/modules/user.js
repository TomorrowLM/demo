/* eslint-disable no-unused-vars */
/**
 * 向后端请求用户信息
 */
import {
  userInfo,
} from '@/api'
import Vue from 'vue'

const user = {
  state: Vue.observable({
    userInfo: {},
    role: '',
  }),
  //更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
  mutations: {
    SET_USER_INFO: (state, data) => {
      console.log(data, 111);
      state.userInfo[data.type] = data.data
      console.log(state.userInfo[data.type]);
    },
    change_role: (state, data) => {
      state.role = data.role
      console.log('change_role:', state.role);
    },
  },
  //Action 提交的是 mutation，而不是直接变更状态。Action 可以包含任意异步操作。
  actions: {
    async GetUserCoreInfo({ commit, rootState }) {
      // const result = await userInfo()
      // commit('SET_CORE_INFO', result)
    },
  }
}

export default user
