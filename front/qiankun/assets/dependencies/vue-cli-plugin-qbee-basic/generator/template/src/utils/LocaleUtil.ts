import { localeUtil, LanguageType } from '@qbee/qbee-common-lib';

/**
 * 获取当前引用语言
 * @export
 * @returns {string}
 */
export function getCurrentLanguage(): LanguageType {
  return localeUtil.getCurrentLanguage();
}
