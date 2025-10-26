import * as RequestUtil from '@/utils/RequestUtil';
import { authUrlPrefix } from '@/constants/UrlPrefix';
export function changeListItemStatus() {
  return RequestUtil.sendRequest({
    url: authUrlPrefix + '/test/mock',
    method: RequestUtil.Method.PUT
  });
}
