/**
 * 对axios-》request进行二次封装
 */
import qs from "qs";
import { md5 } from 'js-md5';
import axios from 'axios';
import { repeatHandle as preventRequest } from './util';

// 缓存时间
const cacheTime = 5000

interface CustomConfigProp {
  cacheTime?: number;
  isCache: boolean;
}

interface RequestParams {
  method: string;
  url: string;
  [key: string]: any;
}

interface RequestBody {
  params: RequestParams;
  request: any;
}

function useRequest<ReqProp>(requestBody: RequestBody, config: CustomConfigProp) {
  // 创建一个 CancelToken 对象
  const { params, request } = requestBody
  let resData = {}
  console.log(123123, requestBody, params, request)
  const requestFn = (data: ReqProp) => {
    const source = axios.CancelToken.source();
    const preventRequestConfig = {
      config: {
        ...params,
        param: params.method === 'get' && data,
        data: params.method !== 'get' && data,
      },
      triggerTime: new Date().valueOf(),
      cancel: source.cancel
    }
    // 检查是否存在重复请求，若存在则取消上次的请求
    if (preventRequest.checkRepeatRequest(preventRequestConfig.config)) {
      preventRequest.getRequestMapInfo(preventRequestConfig.config).cancel('重复请求');
    }
    preventRequest.addRequest(preventRequestConfig);
    return request({
      ...params,
      url: params.url,
      param: params.method === 'get' && data,
      data: params.method !== 'get' && data,
      // 将 cancelToken 属性设置为上面创建的 CancelToken 实例
      cancelToken: source.token
    }).then(res => {
      console.log(res, 'res');
      res.data && (preventRequest.getRequestMapInfo(preventRequestConfig.config).data = res)
      return res
    })
  }
  const cacheRequest = async (data: ReqProp) => {
    const preventRequestConfig = {
      config: {
        ...params,
        param: params.method === 'get' && data,
        data: params.method !== 'get' && data,
      },
      triggerTime: new Date().valueOf(),
    }
    const triggerTime = preventRequest.getRequestMapInfo(preventRequestConfig.config)?.triggerTime
    resData = preventRequest.getRequestMapInfo(preventRequestConfig.config)?.data
    console.log(preventRequest.getRequestMapInfo(preventRequestConfig.config), 123123)
    if (new Date().valueOf() - triggerTime < cacheTime && triggerTime && resData) {
      console.log('缓存请求', resData);
      return resData
    } else {
      return requestFn(data)
    }
  }
  return {
    resData,//在commonjs并不能实现值的拷贝
    // loading,
    // error,
    requestFn: config.isCache ? cacheRequest : requestFn,
  }
}


// module.exports = useRequest
export default useRequest