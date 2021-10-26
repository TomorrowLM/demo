import { request } from 'umi';

/**
 * 下载薅羊毛用户
 */
export async function downLoadRuleUser(params: object) {
  return request('export/downLoadRuleUser', {
    method: 'POST',
    data: { ...params }
  });
}

/**
 * 疑似刷题用户下载
 */
 export async function downLoadBrushAnswerUser(params: object) {
  return request('export/downLoadBrushAnswerUser', {
    method: 'POST',
    data: { ...params }
  });
}

/**
 * 日报更新
 */
 export async function downLoadUpdateDaily(params: object) {
  return request(`daily/makeDailyData?date=${params.date}`, {
    method: 'GET'
  });
}