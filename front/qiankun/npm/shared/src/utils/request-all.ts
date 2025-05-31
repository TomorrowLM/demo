// import Vue from 'vue'
import axios from 'axios';
import qs from "qs";
import md5 from 'js-md5';
const CancelToken = axios.CancelToken;
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
  console.log(requestInfo, requestInfo.triggerTime, 'requestInfo');
  return requestMap.has(requestInfo) && new Date().valueOf() - getRequestMapInfo(config).triggerTime < cacheTime
}

/**
 * 添加请求
 * @param {Object} config
 */
const addRequest = ({ config, triggerTime, cancel }) => {
  // 获取当前请求信息
  const requestInfo = getRequestKey(config)
  requestMap.set(requestInfo, { config, triggerTime, cancel })
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
  const { url, data, method, param } = config
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

// const axios = require('axios');
let service = null;

//code信息
const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  405: "请求方法不被允许。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

const err = (error) => {
  console.log('error', error);
  if (error.response) {
    const data = error.response.data;
    if (error.response.status === 403) {
      // Message.error('Forbidden');
      error.msg = "Forbidden"
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      // Message.error('token失效');
      error.msg = "token失效"
      window.location.pathname = "login"
      window.localStorage.removeItem('token');
    }
  } else {
    // 请求超时状态
    if (error.message.includes('timeout')) {
      // Message.error('请求超时，请检查网络是否连接正常');
      error.msg = "请求超时，请检查网络是否连接正常"
    } else if (!window.navigator.onLine) {
      // 可以展示断网组件
      // Message.error('请求失败，请检查网络是否已连接');
      error.msg = "请求失败，请检查网络是否已连接"
    }
  }
  return error;
};
/**
 * 处理参数
 * @param {*} config
 */
const handleRequest = (config) => {
  const token = window.localStorage.getItem('token');
  config.headers.authorization = `Bearer ${token}`;
  // 检查是否存在重复请求，若存在则取消当前的请求
  if (preventRequest.checkRepeatRequest(config)) {
    // 其他模块触发相同接口
    // return Promise.reject(getRequestMapInfo(config).data)
    // return Promise.resolve(new Error('重复请求'))
    preventRequest.getRequestMapInfo(config).cancel('重复请求')
  }
  let cancel = null
  config.cancelToken = new CancelToken((c) => {
    cancel = c
  });
  preventRequest.addRequest({ config, triggerTime: new Date().valueOf(), cancel: cancel }); // 把当前请求信息添加到pendingRequest对象中
  return config;
};
/**
 * 处理参数
 * @param {*} config
 */
const handleResponse = async (response) => {
  if (response.data.code !== 200) {
    return Promise.reject(response.data);
  }
  response.data && (preventRequest.getRequestMapInfo(response.config).data = response?.data)
  return Promise.resolve(response.data);
};

const serveceHandle = (baseURL: string) => {
  console.log(baseURL, 'baseURL');
  // 创建 axios 实例
  service = axios.create({
    baseURL: baseURL, // api base_url
    timeout: 6000,// 请求超时时间
    headers: {
      'Content-Type': 'application/json',
    }
  })
  console.log(service, 'service');
  service.defaults.headers.post['Content-Type'] = 'application/json';
  // request interceptor
  service.interceptors.request.use(config => {
    console.log('interceptors.request', config);
    return handleRequest(config)
  }, err)
  // response interceptor
  service.interceptors.response.use((response) => {
    console.log('interceptors.response', response);
    return handleResponse(response);
  }, err)
  return service
}

module.exports = serveceHandle
