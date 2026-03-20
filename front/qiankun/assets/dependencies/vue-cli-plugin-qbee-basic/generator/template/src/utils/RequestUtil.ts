/**
 * 请求封装工具类
 */

import { requestUtil, RequestParam, Method } from '@qbee/qbee-common-lib';
import { Token } from './TokenUtil';

export const pcRequest = new requestUtil.PCRequest(Token);
/**
 *
 * @param {RequestParam} param
 * @param param.teamId
 * @param param.timeout default: 20000
 */
function sendRequest(param: RequestParam) {
  return pcRequest.sendRequest(param);
}
export { Method, sendRequest };
