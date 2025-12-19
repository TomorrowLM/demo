import request from '@/utils/request';

// 可根据后端接口补充更精确的字段
export interface LoginParams {
  username?: string;
  password?: string;
  [key: string]: any;
}

export interface LoginResponse {
  token?: string;
  [key: string]: any;
}

export const userInfoApi = (): Promise<any> => {
  return request.get('/common/userInfo');
};
export const menuApi = (): Promise<any> => {
  return request.get('/common/menuList', {});
};
export const login = (params: LoginParams): Promise<LoginResponse> => {
  return request.post<LoginResponse>('/white/login', params, {});
};
///common/setTimeOut
export const setTimeOutApi = (): Promise<any> => {
  return request.get('/common/setTimeOut');
} 