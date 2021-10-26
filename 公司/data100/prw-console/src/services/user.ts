import { request } from 'umi';

export async function queryCurrent() {
  return request<API.CurrentUser>('getInfo');
}

export async function queryDownloadCenterList(params: Object) {
  return request<{ data: API.DownloadCenterData }>('download/list', { params });
}

export async function deleteDownloadCenterList(params: Object) {
  return request(`download/delete`, { method: "DELETE", params });
}

export async function getRouters() {
  return request('getRouters');
}
