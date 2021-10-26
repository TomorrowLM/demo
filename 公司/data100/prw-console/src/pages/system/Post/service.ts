import { request } from 'umi';

export async function getPostList(params: Object) {
  return request('system/post/list', { params });
}

export async function systemPost(method: string, params: Object) {
  return request('system/post', {
    method,
    data: {
      ...params
    }
  });
}

export async function deleteSystemPost(deptId: string) {
  return request(`system/post/${deptId}`, { method: "DELETE" });
}