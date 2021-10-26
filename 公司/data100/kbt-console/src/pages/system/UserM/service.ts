import { request } from 'umi';

export async function getDeptTreeselect() {
  return request('system/dept/treeselect');
}

export async function getUserList(params: Object) {
  return request('system/user/list', { params });
}

export async function systemUser(method: string, params: Object) {
  return request('system/user', {
    method,
    data: {
      ...params
    }
  });
}

export async function getSystemUser(method: string, userId: string | number) {
  return request(`system/user/${userId}`, { method });
}

export async function changeStatus(params: Object) {
  return request(`system/user/changeStatus`, {
    method: "PUT",
    data: {
      ...params
    }
  });
}

export async function resetPwd(params: Object) {
  return request(`system/user/resetPwd`, {
    method: "PUT",
    data: {
      ...params
    }
  });
}

