import { request } from 'umi';

/**
 * 获取api隶属客户
 * @param params 
 */
export async function getApiSurveyProviders() {
  return request('center-account/apiSurvey/providers');
}

/**
 * 获取api渠道列表
 * @param params 
 */
export async function getApiPartnerList() {
  return request('center-account/apiPartner/list');
}

/**
 * 获取渠道下拉列表
 */
export async function getPartnerDropDown() {
  return request('center-account/surveyManager/survey/partner/survey_partner_drop_down');
}

/**
 * 获取所有渠道下拉列表
 */
export async function getAllPartnerList() {
  return request('center-account/allPartner/list');
}
