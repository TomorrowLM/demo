import { request } from 'umi';

export async function getMonitorOnlineList(params: Object) {
  return request('monitor/online/list', { params });
}

export async function deleteMonitorOnline(tokenId: string) {
  return request(`monitor/online/${tokenId}`, { method: "DELETE" });
}