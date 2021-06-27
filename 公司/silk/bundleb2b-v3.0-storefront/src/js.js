import { merge } from 'lodash'

const useJavaScript = window.b3themeConfig ?.useJavaScript ?? {}

export default merge({}, {
  tpa: {},
  login: {},
  dashboard: {},
  b3storage: {},
  quickorderpad: {},
  usermanagement: {},
  buyagain: {},
  shoppinglists: {},
  shoppinglist: {},
  addressbook: {},
  orders: {},
  orderdetail: {},
  accountsetting: {},
}, useJavaScript)
