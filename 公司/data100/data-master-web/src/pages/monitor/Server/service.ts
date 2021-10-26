import { request } from 'umi';

export async function getMonitorServer() {
  return request('center-account/monitor/server');
}