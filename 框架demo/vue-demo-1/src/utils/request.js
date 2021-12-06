import Vue from 'vue'
import axios from 'axios'
import { Toast, Dialog } from 'vant'
import { VueAxios } from './axios'

Toast.allowMultiple();
console.log(111);
// 创建 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
    timeout: 6000 // 请求超时时间
})
let showLoading = null
const failToast = (msg) => {
    Toast.fail({
      duration: 2000,
      message: msg
    })
}
const err = (error) => {
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
    return Promise.reject(error)
}
/**
 * 处理参数
 * @param {*} config 
 */
 const handleParams = (config) => {
    Vue.ls.set('token', 'D50487833CA582D75DC6332116CAB53C39CEB6800A33D97692C12C2BF1564108');
    const token = Vue.ls.get('token', '')
    const { method } = config
    return config
  }
// request interceptor
service.interceptors.request.use(config => {
    return handleParams(config)
}, err)
// response interceptor
service.interceptors.response.use((response) => {
    return response
},err)
export default service