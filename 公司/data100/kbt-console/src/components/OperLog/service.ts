import { request } from 'umi';

/**
 * 获取操作日志
 * @param params 
 */
export async function getLogDetails(params: object) {
  return request('log/record', { params });
}