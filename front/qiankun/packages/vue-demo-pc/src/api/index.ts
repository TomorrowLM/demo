import request from '@/utils/request';
console.log(request, 111);

export const userInfoApi = params => {
  return request.get('/common/users', params);
};

export const login = params => {
  console.log(params);
  return request.post('/white/login', params);
};
