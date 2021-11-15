import styles from './styles'
import text from './text'
import js from './js'
import containers from './containers'

export default {
  apiBaseUrl: process.env.API_BASE_URL,
  appClientId: process.env.APP_CLIENT_ID,
  doms: {
    dashboard: {
      name: text['nav.button.dashboard'],
      url: '/dashboard/',
      isNav: true,
      container: containers['dashboard.container'],
      buttonContainer: containers['dashboard.button.container'],
      mobileContainer: containers['dashboard.button.container--s'],
    },
    tpa: {
      name: text['nav.button.tpa'],
      container: {
        default: containers['tpa.container'],
        guest: containers['tpa.guest.container'],
      },
      buttonContainer: containers['tpa.button.container'],
      mobileContainer: containers['tpa.button.container--s'],
      url: {
        default: '/trade-professional-application/',
        guest: '/login.php?action=create_account&show_tpa',
      },
    },
    shoppinglists: {
      name: text['nav.button.shoppinglists'],
      url: '/shopping-lists/',
      isNav: true,
      container: containers['shoppinglists.container'],
      buttonContainer: containers['shoppinglists.button.container'],
      mobileContainer: containers['shoppinglists.button.container--s'],
    },
    shoppinglist: {
      name: 'Shopping List',
      url: '/shopping-list/',
      container: containers['shoppinglist.container'],
    },
    addressBook: {
      name: text['nav.button.addressBook'],
      url: '/address-book/',
      container: containers['addressBook.container'],
      buttonContainer: containers['addressBook.button.container'],
      mobileContainer: containers['addressBook.button.container--s'],
      isNav: true,
    },
    orders: {
      name: 'Orders',
      url: '/account.php?action=order_status',
      container: containers['orders.container'],
    },
    orderDetail: {
      name: 'Order #',
      url: '/order-detail/',
      container: containers['orderDetail.container'],
    },
    quickOrderPad: {
      name: text['nav.button.quickOrderPad'],
      url: '/quick-order-pad/',
      container: containers['quickOrderPad.container'],
      buttonContainer: containers['quickOrderPad.button.container'],
      mobileContainer: containers['quickOrderPad.button.container--s'],
    },
    buyAgain: {
      name: text['nav.button.buyAgain'],
      url: '/buy-again/',
      isNav: true,
      container: containers['buyAgain.container'],
      buttonContainer: containers['buyAgain.button.container'],
      mobileContainer: containers['buyAgain.button.container--s'],
    },
    userManagement: {
      name: text['nav.button.userManagement'],
      url: '/user-management/',
      container: containers['userManagement.container'],
      buttonContainer: containers['userManagement.button.container'],
      mobileContainer: containers['userManagement.button.container--s'],
      isNav: true,
    },
    quote: {
      url: '/quote-detail/',
      container: containers['rfq.quoteDetail.container'],
    },
  },
  accountPages: {
    'pages/account/orders/all': 'orders',
    'pages/account/orders/completed': 'orders',
    'pages/account/orders/details': 'orders',
    'pages/account/add-address': 'addresses',
    'pages/account/add-payment-method': 'payment_methods',
    'pages/account/add-return': 'returns',
    'pages/account/add-wishlist': 'wishlists',
    'pages/account/addresses': 'addresses',
    'pages/account/download-item': 'orders',
    'pages/account/edit-payment-method': 'payment_methods',
    'pages/account/edit': 'settings',
    'pages/account/inbox': 'messages',
    'pages/account/payment-methods': 'payment_methods',
    'pages/account/recent-items': 'recent_items',
    'pages/account/return-saved': 'returns',
    'pages/account/returns': 'returns',
    'pages/account/wishlist-details': 'wishlists',
  },
  text,
  styles,
  js,
}
