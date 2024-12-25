import request from '@/utils/request'

console.log(request);
export const userInfo = (params) => {
  return request.get('/common/users', params)
}

export const login = (params) => {
  console.log(params);
  return request.post('/white/login', params)
}