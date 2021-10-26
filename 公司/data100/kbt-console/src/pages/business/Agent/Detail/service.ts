import { request } from 'umi';

/**
 * 代理数据
 * @param params
 */
export async function getAgentDetail(params: Object) {
  return request(`agent/getAgentDetail`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 代理列表
 * @param params
 */
export async function getAgentList() {
  return request(`agent/getAgentList`, {
    method: "GET",
  });
}


export async function deleteTask(taskIds: String) {
  return request(`task/deleteTask`, {
    method: "POST",
    data:{
      taskIds
    }
  });
}


