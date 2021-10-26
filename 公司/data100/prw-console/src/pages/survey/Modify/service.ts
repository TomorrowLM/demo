import { request } from 'umi';

/**
 * 拉取问卷信息
 * @param surveyId 
 */
export async function getSurveyManagerDetail(params: object) {
  return request(`surveyManager/survey/detail`, { params });
}

/**
 * 新增问卷
 * @param params 
 */
export async function surveyManagerAdd(params: object) {
  return request(`surveyManager/survey/add`, { method: 'POST', data: params });
}

/**
 * 编辑问卷
 * @param params 
 */
export async function surveyManagerEdit(params: object) {
  return request(`surveyManager/survey/edit`, { method: 'PUT', data: params });
}