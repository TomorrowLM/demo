import Vue from 'vue'
import axios from 'axios'
import { Toast, Dialog } from 'vant'
import { VueAxios } from './axios'

//单例模式，即同一时间只会存在一个 Toast
Toast.allowMultiple();
axios.defaults.headers.post['Content-Type'] = 'application/json';
// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 6000,// 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  }
})

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

let showLoading = null
const failToast = (msg) => {
  Toast.fail({
    duration: 2000,
    message: msg
  })
}
const err = (error) => {
  console.log(error);
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      failToast('Forbidden')
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      failToast('Unauthorized')
    }
  } else {
    // 请求超时状态
    if (error.message.includes('timeout')) {
      console.log('超时了')
      failToast('请求超时，请检查网络是否连接正常')
    } else {
      // 可以展示断网组件
      console.log('断网了')
      failToast('请求失败，请检查网络是否已连接')
    }
  }
  showLoading && showLoading.clear()
  showLoading = null
  console.log(location.pathname !== "/login", location.pathname);
  return Promise.reject(error)
}
/**
 * 处理参数
 * @param {*} config
 */
const handleParams = (config) => {
  console.log(config);
  const token = Vue.ls.get('token')
  const { method } = config
  if (token) {
    config.headers.authorization =
      "Bearer " + token;
  }
  return config
}
// request interceptor
service.interceptors.request.use(config => {
  return handleParams(config)
}, err)
// response interceptor
service.interceptors.response.use((response) => {
  console.log(response);
  return response.data
}, err)

// Vue.prototype.service = service
// export { service as axios }

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}