import { request } from 'umi';

/**
 * 代理列表
 * @param params
 */
export async function agentUser(params: Object) {
  // console.log(params)
  const {field,keyword,pageSize,pageNo} = params
  return request(`agent/agentUser?field=${field}&keyword=${keyword}&pageNo=${pageNo}&pageSize=${pageSize}`, {
    method: "GET",
  });
}

/**
 * 新增
 * @param params
 */

export async function insertAgent( params: Object) {
  return request('agent/insertAgent', {
    method: "POST",
    data: {
      ...params
    }
  });
}
/**
 * 修改
 * @param params
 */

export async function updateAgent( params: Object) {
  return request('agent/updateAgent', {
    method: "PUT",
    data: params
  });
}

/**
 * 删除
 * @param params
 */

export async function deletesAgent( agentIds: String) {
  return request(`agent/deletes?agentIds=${agentIds}`, {
    method: "DELETE",
  });
}

