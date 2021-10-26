import { request } from 'umi';

/**
 * 批量短网址列表
 * @param params 
 */
export async function getShortUrlList(params: Object) {
  return request('tool/shortUrl/list', { params });
}

/**
 * 批量导入自主短网址
 * @param params 
 */
export async function shortUrlImport(params: FormData) {
  return request('tool/shortUrl/import', {
    method: 'POST',
    data: params
  });
}

/**
 * 少量短网址-转换
 * @param params 
 */
export async function updataShortUrlAdd(params: Object) {
  return request('tool/shortUrl/add', {
    method: 'POST',
    data: {
      ...params
    }
  });
}
