import { request } from 'umi';

export async function getOperlogList(params: Object) {
  return request('monitor/operlog/list', { params });
}

export async function deleteOperlog(operId: string) {
  return request(`monitor/operlog/${operId}`, { method: "DELETE" });
}

export async function operlogClean() {
  return request(`monitor/operlog/clean`, { method: "DELETE" });
}