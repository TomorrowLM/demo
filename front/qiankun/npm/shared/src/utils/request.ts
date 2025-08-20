// import Vue from 'vue'
import axios from 'axios';
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

const err = (error: any) => {
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
      // window.location.pathname = "login"
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
 * 请求拦截
 * @param {*} config
 */
const handleRequest = (config: any) => {
  console.log('handleRequest', config,);
  const token = window.localStorage.getItem('token');
  config.headers.authorization = `Bearer ${token}`;
  return config;
};
/**
 * 响应拦截
 * @param {*} config
 */
const handleResponse = async (response: any) => {
  if (response.data.code !== 200) {
    return Promise.reject(response.data);
  }
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
