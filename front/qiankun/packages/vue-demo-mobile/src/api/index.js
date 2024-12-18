import { axios } from '@/utils/request'

const request = (url, params = {}, method = 'post') => {
  return ['post', 'put'].includes(method) ? axios({ url, method, data: params }) : axios({ url, method, params })
}

export const userInfo = (params) => {
  // console.log(12,axios);
  // axios.get("users")
  return axios({ url: '/common/users', method: 'get', params: params })
}

export const login = (params) => {
  return axios({ url: '/white/login', method: 'post', data: params })
}