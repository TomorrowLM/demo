/**
 * 对axios-》request进行二次封装
 */
import qs from "qs";
import { md5 } from 'js-md5';
import axios from 'axios';
import { repeatHandle as preventRequest } from './util';

// 缓存时间
var cacheTime = 5000;

function useRequest(requestBody, config) {
  // 创建一个 CancelToken 对象
  var params = requestBody.params;
  var request = requestBody.request;
  var resData = {};

  function requestFn(data) {
    var source = axios.CancelToken.source();
    var preventRequestConfig = {
      config: {
        method: params.method,
        url: params.url,
        param: params.method === 'get' && data,
        data: params.method !== 'get' && data
      },
      triggerTime: new Date().valueOf(),
      cancel: source.cancel
    };

    // 检查是否存在重复请求，若存在则取消上次的请求
    if (preventRequest.checkRepeatRequest(preventRequestConfig.config)) {
      preventRequest.getRequestMapInfo(preventRequestConfig.config).cancel('重复请求');
    }

    preventRequest.addRequest(preventRequestConfig);

    return request({
      method: params.method,
      url: params.url,
      param: params.method === 'get' && data,
      data: params.method !== 'get' && data,
      // 将 cancelToken 属性设置为上面创建的 CancelToken 实例
      cancelToken: source.token
    }).then(function (res) {
      if (res.data) {
        preventRequest.getRequestMapInfo(preventRequestConfig.config).data = res;
      }
      return res;
    });
  }

  function cacheRequest(data) {
    var preventRequestConfig = {
      config: {
        method: params.method,
        url: params.url,
        param: params.method === 'get' && data,
        data: params.method !== 'get' && data
      },
      triggerTime: new Date().valueOf()
    };

    var triggerTime = preventRequest.getRequestMapInfo(preventRequestConfig.config) &&
      preventRequest.getRequestMapInfo(preventRequestConfig.config).triggerTime;

    resData = preventRequest.getRequestMapInfo(preventRequestConfig.config) &&
      preventRequest.getRequestMapInfo(preventRequestConfig.config).data;

    console.log(preventRequest.getRequestMapInfo(preventRequestConfig.config), 123123);

    if (new Date().valueOf() - triggerTime < cacheTime && triggerTime && resData) {
      console.log('缓存请求', resData);
      return Promise.resolve(resData);
    } else {
      return requestFn(data);
    }
  }

  return {
    resData: resData, //在commonjs并不能实现值的拷贝
    // loading,
    // error,
    requestFn: config.isCache ? cacheRequest : requestFn
  };
}

// module.exports = useRequest
export default useRequest;