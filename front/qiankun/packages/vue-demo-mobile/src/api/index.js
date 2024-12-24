import { axios } from '@lm/shared/utils/request'

const request = (url, params = {}, method = 'post') => {
  return ['post', 'put'].includes(method) ? axios({ url, method, data: params }) : axios({ url, method, params })
}

export const userInfo = (params) => {
  // console.log(12,axios);
  // axios.get("users")
  return axios({ url: '/common/users', method: 'get', params })
}

export const login = (params) => {
  return axios({ url: '/white/login', method: 'post', data: params })
}

export const getList = (data) => {
  return axios({ url: data.api, method: data.method ? data.method : 'post', data: data.data })
}
