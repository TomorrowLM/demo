/* eslint-disable no-unused-vars */
import Vue from 'vue'
import axios from 'axios'
import urls from "@/api/index"
import { api } from "@/api/user"
import { api_share } from "@/api/share"
import config from '@/config/defaultSettings'
import { Toast, Dialog } from 'vant'
import { nonce_str, exchangeMD5 } from './base'
import { getWechatOauth } from "@/api/survey";
import { VueAxios } from './axios'

Toast.allowMultiple();

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

const CODE_TYPE = {
  SUCCESS: 1,
  LOGIN_OVERDUE: -1,
  LOGIN_OUT: -2,
  LOG_OFF: -3, // 问卷接口账户注销的情况
  TOAST_0: 0,
  TOAST_2: 2
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
  const token = Vue.ls.get('token', '')
  const { method } = config
  const prs = {
    token,
    terminalCode: sessionStorage.getItem("terminalCode") || 1,
    nonce_str: nonce_str()
  }
  if (['post', 'put'].includes(method)) {
    config.data = { ...prs, ...config.data, }
    if (!config.data.sign) {
      config.data.sign = exchangeMD5(config.data)
    }
  } else {
    config.params = { ...prs, ...config.params }
    if (!config.params.sign) {
      config.params.sign = exchangeMD5(config.params)
    }
  }
  if (!showLoading) {
    showLoading = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 是否禁止点击背景
      message: '加载中'
    });
  }
  if (config.url.includes('distribution')) {
    config.baseURL = process.env.VUE_APP_API_SLS_BASE_URL
  } else {
    config.baseURL = process.env.VUE_APP_API_BASE_URL
  }
  return config
}

// request interceptor
service.interceptors.request.use(config => {
  return handleParams(config)
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  showLoading && showLoading.clear()
  showLoading = null
  const { data: httpData, config: { url } } = response
  const { code, data, msg } = httpData
  if (code == CODE_TYPE.SUCCESS) {
    return response.data
  } else if (typeof httpData === 'string' && httpData.includes('http')) {
    return response.data
  } else {
    if ([CODE_TYPE.LOGIN_OVERDUE, CODE_TYPE.LOGIN_OUT, CODE_TYPE.LOG_OFF].includes(code)) {
      if (!([urls.partition_survey, urls.survey_api_channel, api.userCoreInfo].includes(url) || [urls.is_can_answer].includes(url) && [CODE_TYPE.LOG_OFF].includes(code))) {
        failToast(msg)
        // debugger;
      }
     
      localStorage.clear()
      setTimeout(() => {
        if(sessionStorage.getItem("tabIndex") === "user"){
          window.location.href = `${process.env.VUE_APP_API_BASE_URL}${urls.getWechatOauth}?type=2`
        }else{
          window.location.href = `${process.env.VUE_APP_API_BASE_URL}${urls.getWechatOauth}?type=1`
        }
      }, 2300);
    } else {
      if ([urls.getPhoneCode, urls.verifyPhoneBind,api_share.invitationUserRegister].includes(url) && code === CODE_TYPE.TOAST_0) {//获取验证码
        return response.data
      } else {
        if (data) {
          const { type } = data
          if (![22, 23, 24].includes(type)) {
            Dialog.confirm({
              title: '提示',
              message: msg,
              confirmButtonText: type === 1 ? '前往申诉' : '去绑定',
            }).then(() => {
              if (type === 1) {
                window.location.href = config.appPageUrl
              } else {
                getWechatOauth('?type=1')
              }
            })
          }
        } else {
          failToast(msg)
        }
        return Promise.reject(httpData)
      }
    }
  }
}, err)

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
