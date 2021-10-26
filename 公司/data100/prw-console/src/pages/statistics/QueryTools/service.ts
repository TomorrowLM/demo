import { request } from 'umi';

/**
 * 获取api渠道数据
 */
export async function getApiChannelList() {
  return request('filter/apiChannelList');
}

/**
 * 获取app渠道数据
 */
export async function getAppChannelList() {
  return request('filter/appChannelList');
}

/**
 * 获取手机型号数据
 */
export async function getMobileTypeList() {
  return request('filter/mobileTypeList');
}

/**
 * 根据关键字获取app名称
 */
export async function searchApp(params = {}) {
  return request('filter/searchApp', { params });
}

/**
 * 获取答题终端数据
 */
export async function getSurveyAnswerChannelList() {
  return request('filter/surveyAnswerChannelList');
}

/**
 * 精准推送选项展示页列表
 */
export async function getGeneralTab() {
  return request('dicLabelEntity/generalMemberTab');
}

/**
 * 查询总数
 */
export async function searchNumber(params: object) {
  return request('filter/searchNumber', {
    method: 'POST',
    data: { ...params }
  });
}

/**
 * 下载用户信息
 */
export async function downLoadMember(params: object) {
  return request('filter/downLoadMember', {
    method: 'POST',
    data: { ...params }
  });
}

/**
 * 精准推送--手机型号
 */
 export async function getPhoneModel(params: Object) {
  return request('dicLabelEntity/phoneModel', { method: 'POST', data: params });
}
