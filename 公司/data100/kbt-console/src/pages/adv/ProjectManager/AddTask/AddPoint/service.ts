import { request } from 'umi';

/**
 * 项目列表
 * @param params
 */
export async function getTaskPointList(params: Object) {
  return request('point/getTaskPointList', {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function deletePoints(params: Object) {
  return request('point/deletePoints', {
    method: "POST",
    data: {
      ...params
    }
  });
}


export async function insertPoints(params: Object) {
  return request('point/insertPoints', {
    method: "POST",
    data: {
      ...params
    }
  });
}


export async function getPointUploadProgress(taskId: string) {
  return request('point/getPointUploadProgress?taskId='+taskId);
}
