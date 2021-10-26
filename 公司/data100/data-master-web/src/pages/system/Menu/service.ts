import { request } from 'umi';

export async function getMenuList(params: Object) {
  return request('center-account/system/menu/list', { params });
}

export async function systemMenu(method: string, params: Object) {
  return request('center-account/system/menu', {
    method,
    data: {
      ...params
    }
  });
}

export async function deleteSystemMenu(deptId: number) {
  return request(`center-account/system/menu/${deptId}`, { method: "DELETE" });
}