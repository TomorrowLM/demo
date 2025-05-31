import request from '@/utils/request';

export const userInfoApi = params => {
  return request.post('/white/ai', params);
};


