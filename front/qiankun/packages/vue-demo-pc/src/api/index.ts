import $lm from '@lm/shared';

import request from '@/utils/request';

console.log(request, 111);
console.log($lm.lodash, 222);

export const userInfo = params => {
  return request.get('/common/users', params);
};

export const login = params => {
  console.log(params);
  return request.post('/white/login', params);
};
