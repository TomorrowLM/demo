/* eslint-disable no-unused-vars */
/**
 * 向后端请求用户信息
 */
import {
  getUserCoreInfo,
  getUserFullInfo,
  getCityDropDown,
  editUserFullInfo,
  savePartnerInfo,
  setPassword,
  checkTodySmsNumber,
  invitationTabShowStatus,
  invitationFriendTabInfo,
  earnDividendTabInfo,
  getApprenticeList,
  getRegistrationInfo,
 } from '@/api/user'

const user = {
  state: {
    userInfo: {},
    fullInfo: {},
    areaList: {},
    registrationInfo: {},
    invitationTabData: [],
    invitationFriendData: {},
    earnDividendData: {},
    apprenticeList: []
  },
  mutations: {
    SET_CORE_INFO: (state, data) => {
      state.userInfo = data
    },
    SET_FULL_INFO: (state, data) => {
      state.fullInfo = data
    },
    SET_AREA_LIST: (state, data) => {
      state.areaList = data
    },
    SET_INVITATION_TAB: (state, data) => {
      state.invitationTabData = data
    },
    SET_INVITATION_FRIEND_DATA: (state, data) => {
      state.invitationFriendData = data
    },
    SET_EARN_DIVIDEND_DATA: (state, data) => {
      state.earnDividendData = data
    },
    SET_APPRENTICE_LIST: (state, data) => {
      state.apprenticeList = data
    },
    SET_REG_INFO: (state, data) => {
      state.registrationInfo = data
    },
  },
  actions: {
    async GetUserCoreInfo ({ commit }) {
      const result = await getUserCoreInfo()
      commit('SET_CORE_INFO', result.data)
    },
    async GetUserFullInfo ({ commit }) {
      const result = await getUserFullInfo()
      commit('SET_FULL_INFO', result.data)
    },
    async EditUserFullInfo ({ commit }, params) {
      return await editUserFullInfo(params)
    },
    async SavePartnerInfo ({ commit }, params) {
      return await savePartnerInfo(params)
    },
    async SetPassword ({ commit }, params) {
      return await setPassword(params)
    },
    async CheckTodySmsNumber ({ commit }, params) {
      return await checkTodySmsNumber(params)
    },
    async GetCityDropDown ({ commit }) {
      const result = await getCityDropDown()
      console.log()
      const areaList = {
        province_list: {},
        city_list: {}
      }
      for (const province of result.data) {
        areaList.province_list[province.id] = province.value
        for (const city of province.childs) {
          areaList.city_list[city.id] = city.value
        }
      }
      commit('SET_AREA_LIST', areaList)
    },
    async GetInvitationTabShowStatus ({ commit }, params) {
      const result = await invitationTabShowStatus(params)
      commit('SET_INVITATION_TAB', result.data)
    },
    async GetInvitationFriendTabInfo ({ commit }, params) {
      const result = await invitationFriendTabInfo(params)
      commit('SET_INVITATION_FRIEND_DATA', result.data)
    },
    async GetEarnDividendTabInfo ({ commit }, params) {
      const result = await earnDividendTabInfo(params)
      commit('SET_EARN_DIVIDEND_DATA', result.data)
    },
    async GetApprenticeList ({ commit }, params) {
      const result = await getApprenticeList(params)
      commit('SET_APPRENTICE_LIST', result.data.list)
    },
    async GetRegistrationInfo ({ commit }) {
      const result = await getRegistrationInfo()
      commit('SET_REG_INFO', result.data)
    },
   
  }
}

export default user
