import { request } from 'umi';
import { } from './data.d';

export async function getDeptList(params: Object) {
  return request('center-account/system/dept/list', { params });
}

export async function systemDept(method: string, params: Object) {
  return request('center-account/system/dept', {
    method,
    data: {
      ...params
    }
  });
}

export async function deleteSystemDept(deptId: number) {
  return request(`center-account/system/dept/${deptId}`, { method: "DELETE" });
}