const basicData = {
  ACTION_TYPE: {
    REDEEM_NOW: '1', // 立即兑换
    GET_CODE: '2', // 获取验证码
    CONFIRM_WITHDRAWAL: '3', // 确认提现
    IS_SET_PASSWORD: '4', // 校验提现密码是否设置
    PASSWORD: '5' // 校验密码
  },
  WITHDRAWAL_TYPE: {
    NO_WECHART: '1', // 非微信
    WECHART: '2', // 微信
    ALIPAY: '3' // 支付宝
  },
  btnTextData: {
    1: '去使用',
    5: '去使用',
    6: '去使用',
    2: '去签到',
    3: '去兑换',
  },
  signInTitle: '提示',
  signInMessage: '奖励丰厚的签到功能目前仅可以在APP端进行，请前往APP使用。',
  signInConfirmButtonText: '前往APP',
  withdrawalSuccessDescription: '提现成功',
  withdrawalSuccessImage: require('../../assets/images/market/withdrawal_success@2x.png'),
  withdrawalSuccessTips: '提现金额已转入您的微信零钱，请前往微信查看。',
  withdrawalSuccessBackText: '返回商城',
  withdrawalGoldCoinText: '金币（个）',
  withdrawalCashText: '现金（元）',
  withdrawalOperationTitle: '提现至',
  withdrawalOperationWechat: '微信零钱',
  withdrawalTips: '提现金额将转入您的微信零钱，请前往微信查看。',
  withdrawalBtnText: '确认提现',
  withdrawalCodeSuccess: '验证码已发送，请查收！',
  withdrawalCodeError: '验证码发送失败！',
}

export default basicData