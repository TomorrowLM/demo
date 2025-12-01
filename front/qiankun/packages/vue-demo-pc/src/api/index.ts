import request from '@/utils/request';

// 可根据后端接口补充更精确的字段
export interface LoginParams {
  username?: string;
  password?: string;
  [key: string]: any;
}

export interface LoginResponse {
  code?: number;
  msg?: string;
  data?: {
    token?: string;
    [key: string]: any;
  };
}

export const userInfoApi = (params: Record<string, any>): Promise<any> => {
  return request.get('/common/users', params, {});
};

export const login = (params: LoginParams): Promise<LoginResponse> => {
  console.log(params);
  return request.post<LoginResponse>('/white/login', params, {});
};
