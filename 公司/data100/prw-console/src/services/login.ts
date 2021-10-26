import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
  uuid: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('logout');
}

export async function getCaptchaImage() {
  return request('captchaImage');
}