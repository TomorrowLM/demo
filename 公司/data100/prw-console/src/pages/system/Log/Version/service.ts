import { request } from 'umi';

export async function getVersionlogList() {
  return request('version/log/list');
}