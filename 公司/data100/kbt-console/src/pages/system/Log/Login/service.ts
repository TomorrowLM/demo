import { request } from 'umi';

export async function getLoginlogList(params: Object) {
  return request('monitor/logininfor/list', { params });
}

export async function deleteLoginlog(operId: string) {
  return request(`monitor/logininfor/${operId}`, { method: "DELETE" });
}

export async function logininforClean() {
  return request(`monitor/logininfor/clean`, { method: "DELETE" });
}