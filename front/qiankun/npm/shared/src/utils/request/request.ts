import axios from 'axios';
import { repeatHandle } from './util.ts'
const preventRequest = repeatHandle
const CancelToken = axios.CancelToken;
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
      error.msg = "请求超时，请检查网络是否连接正常"
    } else if (!window.navigator.onLine) {
      // 可以展示断网组件
      error.msg = "请求失败，请检查网络是否已连接"
    }
  }
  return error;
};
/**
 * 处理参数
 * @param {*} config
 */
const handleRequest = (config: any) => {
  const token = window.localStorage.getItem('token');
  config.headers.authorization = `Bearer ${token}`;
  // 检查是否存在重复请求，若存在则取消当前的请求
  if (preventRequest.checkRepeatRequest(config)) {
    // 其他模块触发相同接口
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
    new Error(codeMessage[response.data.code] || response.data.msg);
    return Promise.reject(response.data);
  }
  response.data && (preventRequest.getRequestMapInfo(response.config).data = response?.data)
  return Promise.resolve(response.data);
};
/**
 * 创建 Axios 实例
 */
const axiosInstance = axios.create({
  baseURL: process.env.APP_PROXY_API,
  timeout: 60000,
  withCredentials: true,
});
axiosInstance.interceptors.request.use(handleRequest, err);
axiosInstance.interceptors.response.use(handleResponse, err);
console.log(process.env, '123process.env.APP_PROXY_API');
const request = {
  get: (url, params, config) => {
    return axiosInstance.get(url, { params, ...config }).then((res) => res)
  },
  post: (url, data, config) => {
    return axiosInstance.post(url, data, config).then((res) => res)
  }
}
export default request
