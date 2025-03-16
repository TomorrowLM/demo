/**
 * 对axios-》request进行二次封装
 */
import qs from "qs";
import md5 from 'js-md5';
import axios from 'axios';
import { data } from "autoprefixer";

const CancelToken = axios.CancelToken;
interface IRequestMap {
  config: any,
  triggerTime: number,
  cancel: any
}
//
interface CutomConfigProp {
  cacheTime?: number,
  isCache: boolean
}
// 缓存请求的接口信息
const requestMap = new Map();
// 缓存时间
const cacheTime = 5000
/**
 * 检查是不是重复请求
 * @param {Object} config
 */
const checkRepeatRequest = config => {
  const requestInfo = getRequestKey(config)
  return requestMap.has(requestInfo)
}

/**
 * 添加请求
 * @param {Object} config
 */
const addRequest = (config) => {
  // 获取当前请求信息
  const requestInfo = getRequestKey(config)
  requestMap.set(requestInfo, config)
}
/**
 * 移除请求
 * @param {Object} config
 */
const removeRequest = config => {
  const requestInfo = getRequestKey(config)
  requestMap.delete(requestInfo)
}

/**
 * 生成标识
 * @param {Object} config
 */
function getRequestKey(config) {
  const { url, data = {}, method = {}, param } = config
  const obj = {
    data,
    param,
    url,
    method
  }
  const sign = md5(qs.stringify(obj)).toUpperCase(); // 这样才能区分是不是同接口且同参数
  return sign
}

// 获取请求信息
function getRequestMapInfo(config) {
  const requestInfo = getRequestKey(config)
  return requestMap.get(requestInfo)
}
/**
 * 清空请求数组
 */
function clearRequestMap() {
  requestMap.clear()
}

const preventRequest = {
  checkRepeatRequest,
  addRequest,
  removeRequest,
  clearRequestMap,
  getRequestMapInfo,
  getRequestKey
}

function useRequest<reqProp>(requestBody, config: CutomConfigProp) {
  // 创建一个 CancelToken 对象
  const { params, request } = requestBody
  let resData = {}
  console.log(123123, requestBody, params, request)
  const requestFn = (data: reqProp) => {
    const source = axios.CancelToken.source();
    const preventRequestConfig = {
      ...params,
      param: params.method === 'get' && data,
      data: params.method !== 'get' && data,
      triggerTime: new Date().valueOf(),
      cancel: source.cancel
    }
    // 检查是否存在重复请求，若存在则取消上次的请求
    if (preventRequest.checkRepeatRequest(preventRequestConfig)) {
      preventRequest.getRequestMapInfo(preventRequestConfig).cancel('重复请求');
    }
    preventRequest.addRequest(preventRequestConfig);
    return request({
      ...params,
      url: params.url,
      param: params.method === 'get' && data,
      data: params.method !== 'get' && data,
      // 将 cancelToken 属性设置为上面创建的 CancelToken 实例
      cancelToken: source.token
    }).then(res => {
      console.log(res, 'res');
      res.data && (preventRequest.getRequestMapInfo(preventRequestConfig).data = res)
      return res
    })
  }
  const cacheRequest = async (data: reqProp) => {
    const preventRequestConfig = {
      ...params,
      param: params.method === 'get' && data,
      data: params.method !== 'get' && data,
      triggerTime: new Date().valueOf(),
    }
    const triggerTime = preventRequest.getRequestMapInfo(preventRequestConfig)?.triggerTime
    resData = preventRequest.getRequestMapInfo(preventRequestConfig)?.data
    console.log(preventRequest.getRequestMapInfo(preventRequestConfig), 123123)
    if (new Date().valueOf() - triggerTime < cacheTime && triggerTime && resData) {
      console.log('缓存请求', resData);
      return resData
    } else {
      return requestFn(data)
    }
  }
  return {
    resData,//在commonjs并不能实现值的拷贝
    // loading,
    // error,
    requestFn: config.isCache ? cacheRequest : requestFn,
  }
}


module.exports = useRequest
// export default useRequest