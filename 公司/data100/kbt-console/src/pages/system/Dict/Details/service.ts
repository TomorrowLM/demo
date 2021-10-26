import { request } from 'umi';

export async function getDictDataList(params: Object) {
  return request('system/dict/data/list', { params });
}

export async function systemDictData(method: string, params: Object) {
  return request('system/dict/data', {
    method,
    data: {
      ...params
    }
  });
}

export async function deleteSystemDictData(dictCode: string) {
  return request(`system/dict/data/${dictCode}`, { method: "DELETE" });
}