import { request } from 'umi';

export async function getLoginlogList(params: Object) {
  return request('center-account/monitor/logininfor/list', { params });
}

export async function deleteLoginlog(operId: string) {
  return request(`center-account/monitor/logininfor/${operId}`, { method: "DELETE" });
}

export async function logininforClean() {
  return request(`center-account/monitor/logininfor/clean`, { method: "DELETE" });
}