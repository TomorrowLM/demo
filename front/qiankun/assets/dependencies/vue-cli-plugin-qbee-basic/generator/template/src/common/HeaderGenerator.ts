import { getCurrentLanguage } from '@/utils/LocaleUtil';

export function getLangHeader(): string {
  return getCurrentLanguage();
}
