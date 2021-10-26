import { request } from 'umi';

/**
 * 获取api隶属客户
 * @param params 
 */
export async function getApiSurveyProviders() {
  return request('apiSurvey/providers');
}

/**
 * 获取api渠道列表
 * @param params 
 */
export async function getApiPartnerList() {
  return request('apiPartner/list');
}

/**
 * 获取渠道下拉列表
 */
export async function getPartnerDropDown() {
  return request('surveyManager/survey/partner/survey_partner_drop_down');
}

/**
 * 获取所有渠道下拉列表
 */
export async function getAllPartnerList() {
  return request('allPartner/list');
}

/**
 * 下拉--隶属事业部
 */
export async function getDepartmentList() {
  return request('common/department_list');
}

/**
 * 下拉--问卷归属
 */
export async function getSurveyAttributionList() {
  return request('common/survey_attribution_list');
}


/**
 * 下拉--创建人
 */
export async function getCreateAdminList(params: Object) {
  return request('common/create_admin_list', { params });
}


/**
 * 获取下拉--省市级联
 */
export async function getCityDropDown(params = {}) {
  return request('common/city_drop_down', { params });
}