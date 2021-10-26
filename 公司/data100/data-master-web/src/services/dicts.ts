import { request } from 'umi';

// 根据字典类型查询字典数据信息
export async function getDicts(dictType: string) {
  return request(`system/dict/data/type/${  dictType}`)
}