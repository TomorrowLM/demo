import locales from '../locales'
import storage from './storage'

export default (langKey) => {
  const lang = storage.lang.val ?? 'en'
  return locales[lang][langKey]
}
