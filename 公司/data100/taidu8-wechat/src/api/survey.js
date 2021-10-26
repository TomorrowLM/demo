import { axios } from '@/utils/request'
import api from "./index"

const request = (url, params = {}, method = 'post') => {
  return ['post', 'put'].includes(method) ? axios({url, method, data: params}) : axios({url, method, params})
}

export function partition_survey (params) {
  return request(api.partition_survey,params)
}

export function survey_api_channel (params) {
  return request(api.survey_api_channel,params)
}

export function is_can_answer (params) {
  return request(api.is_can_answer,params)
}

export function commit_before_question (params) {
  return request(api.commit_before_question,params)
}

export function city_drop_down (params) {
  return request(api.city_drop_down,params)
}
export function getWechatOauth (prammsString) {
  // type: 授权之后跳转的页面 1:跳转问卷列表 2：个人中心 
  window.location.href = process.env.VUE_APP_API_BASE_URL + api.getWechatOauth + prammsString
}

export function cardTicket (params) {
  return request(api.cardTicket,params)
}
export function CardTicketV5 (params) {
  return request(api.CardTicketV5,params)
}
export function surveyCard (params) {
  return request(api.surveyCard,params)
}
export function isHaveTickets (params) {
  return request(api.isHaveTickets,params)
}
export function publicWelfarEelements (params) {
  return request(api.publicWelfarEelements,params)
}
export function isShowPublicWelfar (params) {
  return request(api.isShowPublicWelfar,params)
}

export function respondSurvey (params) {
  return request(api.respondSurvey,params)
}

export function editUserFullInfo (params) {
  return request(api.editUserFullInfo,params)
}

export function getPhoneCode (params) {
  return request(api.getPhoneCode,params)
}

export function editPhone (params) {
  return request(api.editPhone,params)
}
export function surveyMarkedWords (params) {
  return request(api.surveyMarkedWords,params)
}
export function verifyPhoneBind (params) {
  return request(api.verifyPhoneBind,params)
}

export function is_can_answer_share(params){
  return request(api.is_can_answer_share,params)
}

export function shareLink(params){
  return request(api.shareLink,params)
}
export function surveyMarkedWordsCommon(params){
  return request(api.surveyMarkedWordsCommon,params)
}


export function getSurveyShareInfo(params) {
  return request(api.getSurveyShareInfo, params)
}

export function channelRegister(params) {
  return request(api.channelRegister, params)
}
export function welcome(params) {
  return request(api.welcome, params)
}
export function channel_before_question(params) {
  return request(api.channel_before_question, params)
}

export function joinGroupWechatGroup(params) {
  return request(api.joinGroupWechatGroup, params)
}

export function isHaveBasicInfo() {
  return request(api.isHaveBasicInfo)
}