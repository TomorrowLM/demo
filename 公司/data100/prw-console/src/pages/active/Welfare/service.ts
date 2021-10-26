import { request } from 'umi';

/**
 * 公益活动管理--活动列表接口
 * @param params
 */
export async function getList(params: Object) {
  return request('activity_manager/public_welfare/list', {
    method: 'Post',
    data: {
      ...params,
    },
  });
}

/**
 * 公益活动管理--添加活动接口
 * @param params
 */
export async function addWelfare(params: Object) {
  return request('activity_manager/public_welfare/add', {
    method: 'Post',
    data: {
      ...params,
    }
  });
}

/**
 * 公益活动管理--删除活动接口
 * @param params
 */
export async function deleteWelfare(params: Object) {
  return request('activity_manager/public_welfare/delete', { params });
}

/**
 * 公益活动管理--编辑活动接口
 * @param params
 */
export async function editWelfare(params: Object) {
  return request('activity_manager/public_welfare/edit', {
    method: 'Post',
    data: {
      ...params,
    }
  });
}

/**
 * 公益活动管理--下载列表接口
 * @param params
 */
export const downloadUrl=`${process.env.PROXY_API}activity_manager/public_welfare/list_download`



