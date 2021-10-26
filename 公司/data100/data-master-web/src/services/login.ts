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
  return request<API.LoginStateType>('center-account/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`center-account/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('center-account/logout');
}

export async function getCaptchaImage() {
  return request('center-account/captchaImage');
}