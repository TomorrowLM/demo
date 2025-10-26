const localdebug = process.env.VUE_APP_LOCAL_DEBUG === 'yes';
const isProd = process.env.NODE_ENV === 'production';
import QbeeCommonLib from '@qbee/qbee-common-lib';

export const authUrlPrefix =
  isProd || localdebug ? QbeeCommonLib.url.qbeeUrlPrefix.auth : '';
export const msgUrlPrefix =
  isProd || localdebug ? QbeeCommonLib.url.qbeeUrlPrefix.msg : '';
export const portalUrlPrefix =
  isProd || localdebug ? QbeeCommonLib.url.qbeeUrlPrefix.portal : '';
export const userCenterUrlPrefix =
  isProd || localdebug ? QbeeCommonLib.url.qbeeUrlPrefix.usercenter : '';
export const apiUrlPrefix =
  isProd || localdebug ? QbeeCommonLib.url.qbeeUrlPrefix.interface : '';
export const cmsUrlPrefix =
  isProd || localdebug ? QbeeCommonLib.url.qbeeUrlPrefix.mpublish : '';
export const appEngineUrlPrefix =
  isProd || localdebug ? QbeeCommonLib.url.qbeeUrlPrefix.appengine : '';

export const syncUrlPrefix = isProd || localdebug ? '/sync/api' : '';
