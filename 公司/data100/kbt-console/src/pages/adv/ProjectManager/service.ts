import { request } from 'umi';

/**
 * 项目列表
 * @param params
 */
export async function getProjectList(params: Object) {
  return request('project/queryList', {
    method: "POST",
    data: {
      ...params
    }
  });
}


/**
 * 新增
 * @param params
 */

export async function handleProject(method: string, params: Object) {
  return request(params['projectId']?'project/updateProject':'project/addProject', {
    method,
    data: {
      ...params
    }
  });
}


export async function handleDeleteProject(params: Object) {
  return request('project/deleteProject', {
    method: "PUT",params
  });
}
