import { request } from 'umi';

export async function getMenuList(params: Object) {
  return request('system/menu/list', { params });
}

export async function systemMenu(method: string, params: Object) {
  return request('system/menu', {
    method,
    data: {
      ...params
    }
  });
}

export async function deleteSystemMenu(deptId: number) {
  return request(`system/menu/${deptId}`, { method: "DELETE" });
}