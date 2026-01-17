import request from '@/utils/request';

export const userInfo = (params) => {
  return request.get('/common/userInfo', { params });
};

export const login = (params) => {
  return request.post('/white/login', params, {});
};

export const getList = (data) => {
  const method = (data.method || 'post').toLowerCase();
  if (typeof request[method] === 'function') {
    return request[method](data.api, data.data || {}, {});
  }
  return request({ url: data.api, method, data: data.data });
};

