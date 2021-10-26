import { request } from 'umi';

export async function getOperlogList(params: Object) {
  return request('center-account/monitor/operlog/list', { params });
}

export async function deleteOperlog(operId: string) {
  return request(`center-account/monitor/operlog/${operId}`, { method: "DELETE" });
}

export async function operlogClean() {
  return request(`center-account/monitor/operlog/clean`, { method: "DELETE" });
}