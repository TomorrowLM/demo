import { axios } from '@/utils/request'

const api_share = {
  respondSurvey: '/common/respond/respondSurvey',
  bindPhone: '/common/survey/bindPhone',//绑定手机号
  bindgetSmsCode: '/common/survey/getSmsCode',//绑定手机号时获取验证码
  verifyRegistBind: '/common/share/verifyRegistBind',//验证码--滑块前
  commit_before_question: '/survey/inspect/commit_before_question',//提交前置問卷
  getSmsCode: '/common/share/getSmsCode',
  invitationUserRegister: '/common/share/invitationUserRegister',//新用户注册
  recordClockNum: '/common/channel/recordClockNum',//记录下渠道欢迎页的点击
  getPublicWelfare: '/wechatpub/share/welfare/detail'
}
export {api_share}
const request = (url, params = {}, method = 'post') => {
  return ['post', 'put'].includes(method) ? axios({url, method, data: params}) : axios({url, method, params})
}

export function respondSurvey (params) {
  return request(api_share.respondSurvey, params)
}

export function invitationUserRegister (params) {
  return request(api_share.invitationUserRegister, params)
}

export function verifyRegistBind (params) {
  return request(api_share.verifyRegistBind, params)
}

export function getSmsCode (params) {
  return request(api_share.getSmsCode, params)
}
export function recordClockNum (params) {
  return request(api_share.recordClockNum, params)
}

export function getPublicWelfare (params) {
  return request(api_share.getPublicWelfare, params, 'get')
}
