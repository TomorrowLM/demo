import { request } from 'umi';

/**
 * 列表
 * @param params
 */
export async function getSubTaskList(params: Object) {
  return request('subTask/subTaskList', {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 取消子任务预订
 * @param params
 */
 export async function cancelDestine(params: Object) {
  return request('subTask/cancelDestine', {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 子任务上下线
 * @param params
 */
 export async function updatenlineStatus(params: Object) {
  return request('subTask/updatenlineStatus', {
    method: "POST",
    data: {
      ...params
    }
  });
}
/**
 * 获取省市列表
 * @param params
 */
 export async function getAreaInfo() {
  return request('agent/cityDropDown');
}
