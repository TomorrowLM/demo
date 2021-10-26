import { request } from 'umi';

/**
 * 精准推送选项展示页列表
 */
export async function getGeneralTab() {
  return request('dicLabelEntity/generalTab');
}

/**
 * 获取位置信息
 */
export async function getTurnLocation(params: Object) {
  return request('location/turnLocation', { params });
}

/**
 * 精准推送--查询精准推送组列表
 */
export async function getSurveyLabelGroupList(params: Object) {
  return request('surveyLabel/getSurveyLabelGroupList', { params });
}


/**
 * 精准推送--ES查询精准推送人数接口
 */
export async function queryEsPushTotal(params: Object) {
  return request('surveyLabel/queryEsPushTotal', { method: 'POST', data: params });
}

/**
 * 精准推送--新增问卷标签组
 */
export async function addSurveyLabel(params: Object) {
  return request('surveyLabel/addSurveyLabel', { method: 'POST', data: params });
}

/**
 * 精准推送--编辑问卷标签组
 */
export async function editSurveyLabel(params: Object) {
  return request('surveyLabel/editSurveyLabel', { method: 'POST', data: params });
}

/**
 * 精准推送--手机型号
 */
 export async function getPhoneModel(params: Object) {
  return request('dicLabelEntity/phoneModel', { method: 'POST', data: params });
}

/**
 * 精准推送--暂停开启问卷精准推送条件组
 */
export async function updateSurveyLabelRelEntity(params: Object) {
  return request('surveyLabelRelEntity/state', { method: 'PUT', data: params });
}

/**
 * 精准推送--修改问卷精准推送限制 新用户(注册1天内)无视精准推送接口
 */
export async function updateStatus(params: Object) {
  return request('surveyLabel/update_status', { method: 'PUT', data: params });
}

/**
 * 精准推送--是否开启限流
 */
export async function updateLimiting(params: Object) {
  return request('surveyLabel/limiting', { method: 'PUT', data: params });
}

/**
 * 精准推送--查询精准推送组详情
 */
export async function getSurveyLabelGroupInfo(params: Object) {
  return request('surveyLabel/getSurveyLabelGroupInfo', { params });
}

