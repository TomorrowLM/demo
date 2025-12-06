import * as RequestUtil from '@/utils/RequestUtil';

function doGetFetch(url: string, param: any) {
  return RequestUtil.sendRequest({
    url: url,
    method: RequestUtil.Method.GET,
    data: param
  });
}

export function dynamicDropDownMenuFetch(
  url: string,
  param: any
): Promise<any> {
  return doGetFetch(url, param);
}

export function tableFetch(url: string, param: any) {
  return doGetFetch(url, param);
}

export function dropDownTreeFetch(url: string, param: any) {
  return doGetFetch(url, param);
}

export function treeFetch(url: string, param: any) {
  return doGetFetch(url, param);
}
