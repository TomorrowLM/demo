import { request } from 'umi';

/**
 * 获取项目管理所有下拉列表
 */
export async function getSurveyDropDown() {
  return request('surveyManager/survey/drop_down');
}

/**
 * 问卷管理--查询问卷列表（项目、产品、API）
 * @param params 
 */
export async function getSurveyList(params: Object) {
  return request('surveyManager/survey/list', { params });
}

/**
 * 问卷管理--修改问卷状态（项目、产品、API）
 * @param params 
 */
export async function changeStatus(params: Object) {
  return request('surveyManager/survey/edit_status', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

/**
 * 重新邀请--查询可以重新邀请的总人数
 * @param params 
 */
export async function getReinviteUserNum(params: Object) {
  return request('accurate_push/query_reinvite_user', { params });
}


/**
 * 重新邀请--重新邀请被前置问卷甄别的用户
 * @param params 
 */
export async function reinvitePush(params: Object) {
  return request('accurate_push/reinvite', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

/**
 * 问卷管理--API问卷置顶
 * @param params 
 */
export async function changeIsTop(params: Object) {
  return request('surveyManager/survey/top', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}