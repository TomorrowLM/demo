import { axios } from '@/utils/request'

const api = {
  activitySmashEggInfo: '/app/activitySmashEgg/activityInfo',
  activitySmashEggWinRecord: '/app/activitySmashEgg/winRecord',
  activitySmashEggSmash: '/app/activitySmashEgg/smash'
}

const request = (url, params = {}, method = 'post') => {
  return ['post', 'put'].includes(method) ? axios({url, method, data: params}) : axios({url, method, params})
}

/**
 * APP砸金蛋活动--获取活动详情信息
 * @param {*} params 
 */
export function getActivitySmashEggInfo (params = {}) {
  return request(api.activitySmashEggInfo, params)
}

/**
 * APP砸金蛋活动--中奖纪录
 * @param {*} params 
 */
export function getActivitySmashEggWinRecord (params = {}) {
  return request(api.activitySmashEggWinRecord, params)
}

/**
 * APP砸金蛋活动--砸蛋抽奖
 * @param {*} params 
 */
export function activitySmashEggSmash (params = {}) {
  return request(api.activitySmashEggSmash, params)
}
