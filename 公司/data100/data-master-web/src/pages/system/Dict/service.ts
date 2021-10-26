import { request } from 'umi';

export async function getDictList(params?: Object) {
  return request('center-account/system/dict/type/list', { params });
}

export async function systemDict(method: string, params: Object) {
  return request('center-account/system/dict/type', {
    method,
    data: {
      ...params
    }
  });
}

export async function deleteSystemDict(dictId: string) {
  return request(`center-account/system/dict/type/${dictId}`, { method: "DELETE" });
}