import { request } from 'umi';

export async function getMonitorServer() {
  return request('monitor/server');
}