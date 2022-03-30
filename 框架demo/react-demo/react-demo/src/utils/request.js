import axios from "axios";
import store from "../store";
import { message, notification, Button, Space, Spin } from 'antd';
import ReactDOM from 'react-dom';
import React from 'react';
// import {HashRouter} from 'react-router-dom'    //如果使用的是hash路由类型，使用这个
// const router = new HashRouter()

import { BrowserRouter } from 'react-router-dom'
const router = new BrowserRouter()

const API_BASE_URLS = {
  development: "http://121.40.61.99:3600/",
  production: "http://121.40.61.99:3600/"
};

const request = axios.create({
  baseURL: API_BASE_URLS[process.env.NODE_ENV],
});

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  405: "请求方法不被允许。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};
// 当前正在请求的数量
let requestCount = 0
// 显示loading
function showLoading() {
  if (requestCount === 0) {
    const dom = document.createElement('div')
    dom.setAttribute('id', 'loading')
    dom.setAttribute('style', {
      position: "absolute",

    })
    document.body.appendChild(dom)
    ReactDOM.render(<Spin tip="努力加载中..." delay={2000} size="large" />, dom)
  }
  requestCount += 1;
}

// 隐藏loading
function hideLoading() {
  requestCount -= 1;
  if (requestCount === 0) {
    const loading = document.getElementById('loading');
    document.body.removeChild(loading);
  }
}
/**
 * 异常处理程序
 */
export const errorHandler = (error) => {
  hideLoading();
  if (error.response) {
    const {
      response: {
        status,
        data
      },
    } = error;
    if (status) {
      const errorText = data || codeMessage[status];
      if (status === 500) {
        message.error(errorText);
      } else if (status === 400) {
        message.info(errorText);
      } else if (status === 401) {
        window.localStorage.removeItem("token");
        localStorage.removeItem('token');
        window.location.hash = "user/login"
        message.info(errorText);
      }
    }
    if (!status) {
      notification.error({
        description: "您的网络发生异常，无法连接服务器",
        message: "网络异常",
      });
    }
  } else if (error.message.includes("timeout")) {
    // 请求超时状态
    notification.error({
      description: "求超时，请检查网络是否连接正常",
      message: "网络异常",
    });
  } else {
    // 可以展示断网组件
    notification.error({
      description: "请求失败，请检查网络是否已连接",
      message: "网络异常",
    });
  }
  return error;
};
request.interceptors.request.use((config) => {
  //调用接口时 设置axios(ajax)请求头Authorization的格式为`Bearer ` +token
  config.headers.authorization =
    "Bearer " + window.localStorage.getItem("token");
  showLoading();
  return config;
});
request.interceptors.response.use(
  (resp) => {
    hideLoading();
    return resp;
  },
  (respError) => {
    // console.log(respError, respError.response)
    errorHandler(respError)
    return respError.response;
  }
);

export default request;