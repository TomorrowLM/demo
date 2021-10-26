import { request } from 'umi';

// 撤销数据交付
export async function summaryReport(params: Object) {
  return request(`center-data-show/reprot/summaryReport`, { params });
}


/**
 * 查询已交付的清洗组列表
 * @param params :{groupId}
 * @returns 
 */
export async function deliveredRuleGroups(params: Object) {
  return request(`center-data-clean/data/deliveredRuleGroups`, { params });
}

/**
 * 查询是否存在交付的数据报告
 * @param params :{groupId}
 * @returns 
 */
 export async function getDeliver(params: Object) {
  return request(`center-data-show/reprot/getDeliver`, { params });
}