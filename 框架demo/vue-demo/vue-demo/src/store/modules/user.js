/* eslint-disable no-unused-vars */
/**
 * 向后端请求用户信息
 */
import {
  userInfo,
} from '@/api'

const user = {
  state: {
    userInfo: {},
  },
  mutations: {
    SET_CORE_INFO: (state, data) => {
      state.userInfo = data
    },

  },
  actions: {
    async GetUserCoreInfo({ commit }) {
      const result = await userInfo()
      commit('SET_CORE_INFO', result.data)
    },
  }
}

export default user
