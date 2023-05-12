import request from '@/utils/request'

console.log(request);
export const userInfo = (params) => {
  return request.get('users', params)
}

export const login = (params) => {
  console.log(params);
  return request.post('login', params)
}