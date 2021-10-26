import { axios } from '@/utils/request'

const api = {
  // requestUserId: '/distribution/rp/requestUserId',
}
export {api}
const request = (url, params = {}, method = 'post') => {
  return ['post', 'put'].includes(method) ? axios({url, method, data: params}) : axios({url, method, params})
}

// export function requestUserId (params) {
//   return request(api.requestUserId, params,'get')
// }


