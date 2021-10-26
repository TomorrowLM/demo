import { request } from 'umi';

export async function getMonitorOnlineList(params: Object) {
  return request('center-account/monitor/online/list', { params });
}

export async function deleteMonitorOnline(tokenId: string) {
  return request(`center-account/monitor/online/${tokenId}`, { method: "DELETE" });
}