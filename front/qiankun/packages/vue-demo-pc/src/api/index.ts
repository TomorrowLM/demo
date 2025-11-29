import request from '@/utils/request';

export const userInfoApi = params => {
  return request.get('/common/users', params, {});
};

export const login = params => {
  console.log(params);
  return request.post('/white/login', params, {});
};
