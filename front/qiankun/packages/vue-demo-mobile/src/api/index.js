const request = $.service(process.env.VUE_APP_BASE_URL)

export const userInfo = (params) => {
  return request({ url: '/common/users', method: 'get', params })
}

export const login = (params) => {
  return request({ url: '/white/login', method: 'post', data: params })
}

export const getList = (data) => {
  return request({ url: data.api, method: data.method ? data.method : 'post', data: data.data })
}
