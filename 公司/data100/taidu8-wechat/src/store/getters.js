const user = {
  userInfo: state => state.user.userInfo,
  fullInfo: state => state.user.fullInfo,
  areaList: state => state.user.areaList,
  invitationTabData: state => state.user.invitationTabData,
  invitationFriendData: state => state.user.invitationFriendData,
  earnDividendData: state => state.user.earnDividendData,
  apprenticeList: state => state.user.apprenticeList,
  registrationInfo: state => state.user.registrationInfo,
}

const market = {
  homePage: state => state.market.homePage,
  goodsInfo: state => state.market.goodsInfo,
  goodsList: state => state.market.goodsList,
  exchangeReward: state => state.market.exchangeReward,
  exchangeRewardDetail: state => state.market.exchangeRewardDetail,
  cardTicket: state => state.market.cardTicket,
  userGoldIncomeRecord: state => state.market.userGoldIncomeRecord,
  userGoldExpensesRecord: state => state.market.userGoldExpensesRecord,
  userBalance: state => state.market.userBalance,
  cashExchangeMsg: state => state.market.cashExchangeMsg,
}

const getters = {
  ...user,
  ...market
}

export default getters
