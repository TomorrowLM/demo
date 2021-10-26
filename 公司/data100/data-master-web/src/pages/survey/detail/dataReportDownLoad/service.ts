import { request } from 'umi';

// 撤销数据交付
export async function summaryReport(params: Object) {
  return request(`center-data-show/reprot/summaryReport`, { params });
}

