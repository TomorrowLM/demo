import { axios } from '@/utils/request'

const api = {
  goodsList: '/walletmall/mall/goodsPage',
  goodsInfo: '/walletmall/mall/info',
  exchangeReward: '/walletmall/mall/exchange-reward',
  exchangeRewardDetail: '/walletmall/mall/exchange-reward-detail',
  cardTicket: '/walletmall/center/getCardTicket',
  userGoldIncomeRecord: '/walletmall/center/wallet/getUserGoldIncomeRecord',
  userGoldExpensesRecord: '/walletmall/center/wallet/getUserGoldExpensesRecord',
  userBalance: '/walletmall/center/wallet/getUserBalance',
  cashExchangeMsg: '/walletmall/mall/cashExchangeMsg',
  withdrawV5: '/walletmall/sms/withdrawV5', // 提现验证码
  moneyByWechat: '/walletmall/center/wallet/v5/getMoneyByWechat', // 微信提现
  ruleCheck: '/walletmall/rule/check', // 商城规则校验
  commodityExchange: '/walletmall/mall/commodityExchange', // 兑换虚拟商品
  homePage: '/walletmall/mall/homePage'
}

const request = (url, params = {}, method = 'post') => {
  return ['post', 'put'].includes(method) ? axios({url, method, data: params}) : axios({url, method, params})
}

/**
 * 获取商城首页信息
 * @param {*} params 
 */
export function getHomePage (params = {}) {
  return request(api.homePage, params)
}

/**
 * 获取商城精选和影音视频列表
 * @param {*} params 
 */
export function getGoodsList (params = {}) {
  return request(api.goodsList, params)
}

/**
 * 获取商城详情
 * @param {*} params 
 */
export function getGoodsInfo (params = {}) {
  return request(api.goodsInfo, params)
}

/**
 * 获取我的奖品列表
 * @param {*} params 
 */
export function getExchangeReward (params = {}) {
  return request(api.exchangeReward, params)
}

/**
 * 获取商品兑换明细
 * @param {*} params 
 */
export function getExchangeRewardDetail (params = {}) {
  return request(api.exchangeRewardDetail, params)
}

/**
 * 获取我的卡券列表
 * @param {*} params 
 */
export function getCardTicket (params = {}) {
  return request(api.cardTicket, params)
}

/**
 * 获取金币收入明细列表
 * @param {*} params 
 */
export function getUserGoldIncomeRecord (params = {}) {
  return request(api.userGoldIncomeRecord, params)
}

/**
 * 获取金币提现明细列表
 * @param {*} params 
 */
export function getUserGoldExpensesRecord (params = {}) {
  return request(api.userGoldExpensesRecord, params)
}

/**
 * 获取余额、收入总额、提现总额、提现次数
 * @param {*} params 
 */
export function getUserBalance (params = {}) {
  return request(api.userBalance, params)
}

/**
 * 获取金币提现展示
 * @param {*} params 
 */
export function getCashExchangeMsg (params = {}) {
  return request(api.cashExchangeMsg, params)
}

/**
 * 获取提现验证码
 * @param {*} params 
 */
export function getWithdrawV5 (params = {}) {
  return request(api.withdrawV5, params)
}

/**
 * 微信提现
 * @param {*} params 
 */
export function getMoneyByWechat (params = {}) {
  return request(api.moneyByWechat, params)
}

/**
 * 商城规则校验
 * @param {*} params 
 */
export function getRuleCheck (params = {}) {
  return request(api.ruleCheck, params)
}

/**
 * 兑换虚拟商品
 * @param {*} params 
 */
export function getCommodityExchange (params = {}) {
  return request(api.commodityExchange, params)
}