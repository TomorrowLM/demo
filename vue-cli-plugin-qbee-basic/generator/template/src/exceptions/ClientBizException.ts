import { ClientBizException as ErrorClientBizException } from '@qbee/qbee-common-lib';
import { ClientErrorMessage } from './ClientCustomCode';
/**
 * 客户端错误异常
 *
 * @export
 * @class ClientBizException
 * @extends {Error}
 */
export default class ClientBizException extends ErrorClientBizException {
  constructor(code: string) {
    super(code, ClientErrorMessage);
  }
}
