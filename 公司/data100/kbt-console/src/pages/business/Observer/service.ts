import { request } from 'umi';

/**
 * 列表
 * @param params
 */
export async function observerUser(params: Object) {
  return request(`observer/observerList`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 新增
 * @param params
 */

export async function insertObserver( params: Object) {
  return request('observer/insertObserver', {
    method: "POST",
    data: {
      ...params
    }
  });
}
/**
 * 修改
 * @param params
 */

export async function updateObserver( params: Object) {
  return request('observer/updateObserver', {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 修改状态
 * @param params
 */

export async function changeObserverState(params: Object) {
  const { state, observerId } = params
  return request(`observer/updateObserverState?ids=${observerId}&state=${state}`, {
    method: "POST",
  });
}


