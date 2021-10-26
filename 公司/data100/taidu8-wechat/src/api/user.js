import { axios } from '@/utils/request'

const api = {
  userCoreInfo: '/wechatpub/user/getUserCoreInfo',
  userFullInfo: '/wechatpub/user/getUserFullInfo',
  editUserFullInfo: '/wechatpub/user/editUserFullInfo',
  checkSaveAddress: '/wechatpub/user/checkSaveAddress',
  cityDropDown: '/wechatpub/common/city_drop_down',
  savePartnerInfo: '/distribution/survey/partner/savePartnerInfo',
  setPassword: '/walletmall/center/accountPass/setPassword',
  checkTodySmsNumber: '/walletmall/center/accountPass/checkTodySmsNumber',
  invitationTabShowStatus: '/wechatpub/center/invite/invitationTabShowStatus',
  invitationFriendTabInfo: '/wechatpub/center/invite/invitationFriendTabInfo',
  earnDividendTabInfo: '/wechatpub/center/invite/earnDividendTabInfo',
  getApprenticeList: '/wechatpub/center/invite/v2/getApprenticeList',
  getRegistrationInfo: '/survey/inspect/surveyGetRegistrationInfo',
  blindInviteCode: '/wechatpub/center/invite/blindInviteCode',
  get_provinces: '/wechatpub/location/provinces', // 根据经纬度 获取城市信息
}
export {api}
const request = (url, params = {}, method = 'post') => {
  return ['post', 'put'].includes(method) ? axios({url, method, data: params}) : axios({url, method, params})
}

export function getUserCoreInfo (params) {
  return request(api.userCoreInfo, params)
}

export function getUserFullInfo (params) {
  return request(api.userFullInfo, params)
}

export function editUserFullInfo (params) {
  return request(api.editUserFullInfo, params)
}

export function getCityDropDown (params) {
  return request(api.cityDropDown, params)
}

export function savePartnerInfo (params) {
  return request(api.savePartnerInfo, params, 'GET')
}

export function setPassword (params) {
  return request(api.setPassword, params)
}

export function checkTodySmsNumber (params) {
  return request(api.checkTodySmsNumber, params)
}

export function invitationTabShowStatus (params) {
  return request(api.invitationTabShowStatus, params)
}

export function invitationFriendTabInfo (params) {
  return request(api.invitationFriendTabInfo, params)
}

export function earnDividendTabInfo (params) {
  return request(api.earnDividendTabInfo, params)
}

export function getApprenticeList (params) {
  return request(api.getApprenticeList, params)
}

export function getRegistrationInfo (params) {
  return request(api.getRegistrationInfo, params)
}

export function getCheckSaveAddress (params) {
  return request(api.checkSaveAddress, params)
}
export function blindInviteCode (params) {
  return request(api.blindInviteCode, params)
}
export function getProvinces (params) {
  return request(api.get_provinces, params)
}
