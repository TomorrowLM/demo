import request from 'umi-request';

export async function queryCurrent() {
  return request('system/user/profile');
}

export async function updataCurrent(params: object) {
  return request('system/user/profile', { method: 'PUT', data: { ...params } });
}

export async function updataCurrentPwd(params: object) {
  return request('system/user/profile/updatePwd', { method: 'PUT', data: params });
}