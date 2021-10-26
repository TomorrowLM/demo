import {request} from "@@/plugin-request/request";
import {Response} from "@/services/data/Response";
import {message} from "antd";

/**
 * @author sdx
 * @date 2021/7/2
 * 网络请求临时封装
 */


/**
 *
 * @param urlPath 请求的地址，不包含host就可以了。
 * @param data 请求参数。。。
 * @param success 成功之后的回调用
 * @param onFailed 不实现方法，失败统一弹出错误提示。
 */
export async function post<T>(urlPath: string, data: any, success: (t?: T) => void, onFailed?: (msg: string) => void) {
  const response = await request<Response<T>>(urlPath, {
    method: 'POST',
    data,
  });
  if (response.code !== 200) {
    if (onFailed == null) {
      message.error(response.msg)
    } else {
      onFailed(`${response.msg}`)
    }
  } else {
    success(response.data)
  }
}

/**
 *
 * @param urlPath 请求的地址，不包含host就可以了。
 * @param data 请求参数。。。
 * @param success 成功之后的回调用
 * @param onFailed 不实现方法，失败统一弹出错误提示。
 */
export async function get<T>(urlPath: string, data: any, success: (t?: T) => void, onFailed?: (msg: string) => void) {
  let url = urlPath
  if (data) {
    url = `${url}?`
  }
  console.log(typeof data)
  // eslint-disable-next-line no-restricted-syntax
  for (const item in data) {
    if (data.hasOwnProperty(item)) {
      url = `${url}${item}=${data[item.toString()]}&`
    }
  }
  const response = await request<Response<T>>(url, {
    method: 'GET'
  });
  if (response.code !== 200) {
    if (onFailed == null) {
      message.error(response.msg)
    } else {
      onFailed(`${response.msg}`)
    }
  } else {
    success(response.data)
  }
}
