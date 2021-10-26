
import { request } from 'umi';


export async function surveyListInfo(params: Object) {
  return request(`center-data-collect/survey/surveyListInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function updateSurveyInfo(params: Object) {
  return request(`center-data-collect/survey/updateSurveyInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
// 刷新某个问卷
export async function refreshSurveyInfo(params: Object) {
  return request(`center-data-collect/survey/refreshSurveyInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

// 刷新列表
export async function refreshSurveyList(params: Object) {
  return request(`center-data-collect/survey/refreshSurveyList`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function deptUserTree(flag:string) {
  return request(`center-account/system/user/deptUserTree/${flag}`);
}
/**
 * 新增成员管理
 * @param params 
 * @returns 
 */
export async function addManagerUserInfo(params: Object) {
  return request(`center-data-collect/manager/addManagerUserInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
/**查询成员列表信息
 * 
 */
 export async function selectManagerUserInfo(params: Object) {
  return request(`center-data-collect/manager/selectManagerUserInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
/**
 * 删除成员列表信息
*/
export async function deleteManagerUserInfo(params: Object) {
  return request(`center-data-collect/manager/deleteManagerUserInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
/**
 * 创建卡片
*/
export async function addProjectCardService(params: Object) {
  return request(`center-data-collect/survey/addCard`, {
    method: "POST",
    data: {
      ...params
    }
  });
}