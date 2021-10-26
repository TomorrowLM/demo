import { request } from 'umi';

export async function queryCurrent() {
  return request<API.CurrentUser>('center-account/getInfo');
}

export async function queryDownloadCenterList(params: Object) {
  return request<{ data: API.DownloadCenterData }>('center-account/downloadCenter/list', { params });
}

export async function deleteDownloadCenterList(id: Number) {
  return request(`center-account/downloadCenter/del/${id}`, { method: "DELETE" });
}

export async function clearDownloadCenterList() {
  return request(`center-account/downloadCenter/clear`, { method: "DELETE" });
}

export async function getRouters() {
  return request('center-account/getRouters');
}
