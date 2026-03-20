import VueI18n from 'vue-i18n';
import zhLocale from './zh_CN';
import elementZhLocale from 'qt-element-ui/lib/locale/lang/zh-CN';
import { getCurrentLanguage } from '@/utils/LocaleUtil';
import ElementLocale from 'qt-element-ui/lib/locale';

const i18n = new VueI18n({
  locale: getCurrentLanguage(),
  messages: {
    zh: {
      ...zhLocale,
      ...elementZhLocale,
    },
  },
});
ElementLocale.i18n((key: any, value: any) => i18n.t(key, value));

export default i18n;
