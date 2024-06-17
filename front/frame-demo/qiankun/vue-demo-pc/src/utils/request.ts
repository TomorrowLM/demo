import Vue from 'vue';
import axios from 'axios';
import { Message } from 'element-ui';
import { VueAxios } from './axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // api base_url
  // baseURL: '/dev',
  timeout: 6000, // 请求超时时间
});

//code信息
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const err = (error: any) => {
  console.log(error);
  if (error.response) {
    const data = error.response.data;
    if (error.response.status === 403) {
      Message.error('Forbidden');
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      Message.error('token失效');
      window.localStorage.removeItem('token');
    }
  } else {
    // 请求超时状态
    if (error.message.includes('timeout')) {
      Message.error('请求超时，请检查网络是否连接正常');
    } else {
      // 可以展示断网组件
      Message.error('请求失败，请检查网络是否已连接');
    }
  }
  return Promise.reject(error);
};

/**
 * 处理参数
 * @param {*} config
 */
const handleRequest = (config: any) => {
  console.log(config,991239);
  const token = (Vue as any).ls.get('token');
  config.headers.authorization = 'Bearer ' + token;
  return config;
};

/**
 * 处理参数
 * @param {*} config
 */
const handleResponse = async (response: any) => {
  if (response.data.code !== 200) {
    return Promise.reject(response.data);
  }
  return Promise.resolve(response.data);
};

// request interceptor
request.interceptors.request.use(config => {
  return handleRequest(config);
}, err);

// response interceptor
request.interceptors.response.use(response => {
  return handleResponse(response);
}, err);

request.prototype = {
  get: (url: any, config: any) => {
    return request.get(url, { method: 'get', ...config });
  },
  post: (url: any, config: any) => {
    return request.post(url, { method: 'post', ...config });
  },
  all: (config: any) => {
    const { url } = config;
    return request.post(url, { method: 'post', ...config });
  },
  interval: (url: any, method: 'get', config: any) => {
    return request.post(url, { method: method, ...config });
  },
};

export default request;
