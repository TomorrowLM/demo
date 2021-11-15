import './index.global.scss'
import './lib'
import themeConfig from './themeConfig'
import { leftIncludes } from './common/utils/util'
import Tpa from './views/tpa'
import Login from './views/login'
import Dashboard from './views/dashboard'
import B3Storage from './common/utils/B3Storage'
import QuickOrderPad from './views/quickOrderPad'
import UserManagement from './views/userManagement'
import BuyAgain from './views/buyAgain'
import ShoppingLists from './views/shoppinglists'
import ShoppingList from './views/shoppingList'
import AddressBook from './views/addressBook'
import Orders from './views/orders'
import Orderdetail from './views/orderDetail'
import AccountSetting from './views/accountSetting'
import Rfq from './views/rfq'

import { getCurrencies } from './common/api'
import { getCurrency } from './common/utils/currencyFormat'
import RfqQuote from './views/rfqQuote'

const {
  dashboard,
  userManagement,
  buyAgain,
  shoppinglists,
  shoppinglist,
  addressBook,
  orders,
  orderDetail,
  quote,
} = themeConfig.doms

const pages = {
  [dashboard.url]: Dashboard,
  [userManagement.url]: UserManagement,
  [buyAgain.url]: BuyAgain,
  [shoppinglists.url]: ShoppingLists,
  [shoppinglist.url]: ShoppingList,
  [addressBook.url]: AddressBook,
  [orders.url]: Orders,
  [orderDetail.url]: Orderdetail,
}

const fixCurrencyRoutes = () => {
  const $currencies = document.querySelectorAll('#currencySelection li a')
  const query = location.search.substr(1).replace(/setCurrencyId=\d&/, '')

  $currencies.forEach($currency => {
    const defaultCurrencyQuery = $currency.getAttribute('href')
    $currency.setAttribute('href', `${defaultCurrencyQuery}&${query}`)
  })
}

const bootstrap = async () => {
  window.money = window.jsContext.settings.money
  const isLogin = !!window.jsContext.customer

  if (isLogin) {
    await Login.mount()
    if (!B3Storage.B3IsB2CUser.value) {
      window.currencyInfo = await getCurrencies()
      getCurrency()
      fixCurrencyRoutes()
    }
  }

  Tpa.mount()
  QuickOrderPad.mount()
  AccountSetting.mount()
  Rfq.mount()

  const {
    pathname,
    search,
  } = window.location
  let lockUrl = pathname

  if (leftIncludes(lockUrl, quote.url)) RfqQuote.mount()

  Object.entries(pages).forEach(async ([pageUrl, Page]) => {
    if (pageUrl === orders.url) lockUrl += search

    const isLeftIncludes = leftIncludes(lockUrl, pageUrl)

    if (
      isLogin
      && isLeftIncludes
      && !B3Storage.B3IsB2CUser.value
    ) Page.mount()
  })
}

bootstrap()
