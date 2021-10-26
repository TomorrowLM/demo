/**
 * 向后端请求商城信息
 */
import {
  getHomePage,
  getGoodsList,
  getGoodsInfo,
  getExchangeReward,
  getCardTicket,
  getExchangeRewardDetail,
  getUserGoldIncomeRecord,
  getUserGoldExpensesRecord,
  getUserBalance,
  getCashExchangeMsg,
  getWithdrawV5,
  getMoneyByWechat,
  getRuleCheck,
  getCommodityExchange
} from '@/api/market'
import basicData from '@/views/market/const'

const updataList = (stateData, data) => {
  const { currPage, pageSize, totalCount, totalPage, list } = data
  stateData.list = [ ...stateData.list, ...list ]
  stateData.currPage = currPage
  stateData.pageSize = pageSize
  stateData.totalCount = totalCount
  stateData.totalPage = totalPage
}

const user = {
  state: {
    homePage: {},
    goodsList: {},
    goodsInfo: {},
    exchangeReward: {},
    exchangeRewardDetail: {},
    cardTicket: {},
    userGoldIncomeRecord: {},
    userGoldExpensesRecord: {},
    userBalance: {},
    cashExchangeMsg: {}
  },
  mutations: {
    SET_GOODS_LIST: (state, data) => {
      state.goodsList = data
    },
    SET_GOODS_INFO: (state, data) => {
      state.goodsInfo = data
    },
    SET_EXCHANGE_REWARD: (state, data) => {
      data.currPage === 1 ? state.exchangeReward = data : updataList(state.exchangeReward, data)
    },
    SET_EXCHANGE_REWARD_DETAILS: (state, data) => {
      state.exchangeRewardDetail = data
    },
    SET_CARD_TICKET: (state, data) => {
      data.currPage === 1 ? state.cardTicket = data : updataList(state.cardTicket, data)
    },
    SET_USER_GOLD_INCOME_RECORD: (state, data) => {
      data.currPage === 1 ? state.userGoldIncomeRecord = data : updataList(state.userGoldIncomeRecord, data)
    },
    SET_USER_GOLD_EXPENSES_RECORD: (state, data) => {
      data.currPage === 1 ? state.userGoldExpensesRecord = data : updataList(state.userGoldExpensesRecord, data)
    },
    SET_USER_BALANCE: (state, data) => {
      state.userBalance = data
    },
    SET_CASH_EXCHANGE_MSG: (state, data) => {
      state.cashExchangeMsg = data
    },
    SET_HOME_PAGE: (state, data) => {
      state.homePage = data
    },
  },
  actions: {
    async GetHomePage ({ commit }, params) {
      const result = await getHomePage(params)
      commit('SET_HOME_PAGE', result.data)
    },
    async GetGoodsList ({ commit }, params) {
      const result = await getGoodsList(params)
      commit('SET_GOODS_LIST', result.data)
    },
    async GetGoodsInfo ({ commit }, params) {
      const result = await getGoodsInfo(params)
      commit('SET_GOODS_INFO', result.data)
    },
    async GetExchangeReward ({ commit }, params) {
      const result = await getExchangeReward(params)
      commit('SET_EXCHANGE_REWARD', result.data)
    },
    async GetExchangeRewardDetail ({ commit }, params) {
      const result = await getExchangeRewardDetail(params)
      commit('SET_EXCHANGE_REWARD_DETAILS', result.data)
    },
    async GetCardTicket ({ commit }, params) {
      const result = await getCardTicket(params)
      commit('SET_CARD_TICKET', result.data)
    },
    async GetUserGoldIncomeRecord ({ commit }, params) {
      const result = await getUserGoldIncomeRecord(params)
      commit('SET_USER_GOLD_INCOME_RECORD', result.data)
    },
    async GetUserGoldExpensesRecord ({ commit }, params) {
      const result = await getUserGoldExpensesRecord(params)
      commit('SET_USER_GOLD_EXPENSES_RECORD', result.data)
    },
    async GetUserBalance ({ commit }, params) {
      const result = await getUserBalance(params)
      commit('SET_USER_BALANCE', result.data)
    },
    async GetCashExchangeMsg ({ commit }, params) {
      const result = await getCashExchangeMsg(params)
      commit('SET_CASH_EXCHANGE_MSG', result.data)
    },
    // eslint-disable-next-line no-unused-vars
    async GetWithdrawV5 ({ commit }, params) {
      return await getWithdrawV5(params)
    },
    // eslint-disable-next-line no-unused-vars
    async GetMoneyByWechat ({ dispatch }, params) {
      return await getMoneyByWechat(params)
    },
    // eslint-disable-next-line no-unused-vars
    async GetRuleCheck ({ commit }, params) {
      return await getRuleCheck(params)
    },
    async GetCommodityExchange ({ dispatch }, params) {
      const { ACTION_TYPE: { REDEEM_NOW }, WITHDRAWAL_TYPE: { NO_WECHART } } = basicData
      const ruleParams = {
        actionType: REDEEM_NOW,
        withdrawType: NO_WECHART,
        commodityId: params.commodityId,
        cardId: params.cardId
      }
      await dispatch('GetRuleCheck', ruleParams)
      return await getCommodityExchange(params)
    },
  }
}

export default user
