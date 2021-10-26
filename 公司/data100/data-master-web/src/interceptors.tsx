import React from 'react';
import ReactDOM from 'react-dom';
import {ResponseError} from 'umi-request';
import {notification, message, Spin} from 'antd';
import {history} from 'umi';
import {stringify} from 'querystring';

// 当前正在请求的数量
let requestCount = 0

// 显示loading
function showLoading() {
  if (requestCount === 0) {
    const dom = document.createElement('div')
    dom.setAttribute('id', 'loading')
    document.body.appendChild(dom)
    ReactDOM.render(<Spin tip="努力加载中..." delay={500} size="large"/>, dom)
  }
  requestCount += 1;
}

// 隐藏loading
function hideLoading() {
  requestCount -= 1;
  if (requestCount === 0) {
    const loading: any = document.getElementById('loading');
    document.body.removeChild(loading);
  }
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
export const errorHandler = (error: ResponseError) => {
  hideLoading();
  if (error.response) {
    const {response: {code, msg}}: any = error;
    if (code || code === 0) {
      const errorText = msg || codeMessage[code];
      if (code === 500) {
        message.error(errorText);
      } else if (code === 400) {
        message.info(errorText);
      } else if (code === 401) {
        window.localStorage.removeItem('authorization')
        message.info(errorText);
        setTimeout(() => {
          history.replace({
            pathname: '/user/login',
            search: stringify({
              // redirect: window.location.href,
            }),
          });
          window.location.reload();
        }, 500);
      }else {
        // 如果不处理的话，让调用者处理。。。。。。
        return Promise.resolve({
          code,
          msg,
        })
      }
    } else {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
  } else if (error.message.includes('timeout')) {
    // 请求超时状态
    message.error('请求超时，请检查网络是否连接正常')
  } else {
    // 可以展示断网组件
    message.error('请求失败，请检查网络是否已连接')
  }

  throw  error;
};

export const requestInterceptors = [(url: string, options: any) => {
//  debugger;
  const authorization = window.localStorage.getItem('authorization')
  const headers = {
    'authorization': authorization || ''
  };
  if(!options.hideLoading){
    showLoading();
  }
 
  return {
    url: `${process.env.PROXY_API}${url}`,
    options: {...options, headers},
  };
}]

export const responseInterceptors = [async (response: any) => {
  const data = await response.clone().json();
  const {code} = data
  hideLoading();
  if (code !== 200) {
    // 界面报错处理
    // eslint-disable-next-line prefer-promise-reject-errors
    return  Promise.reject({response: data})
  }
  return Promise.resolve(response);
}]
