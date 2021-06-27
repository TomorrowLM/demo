import stencilUtils from '@bigcommerce/stencil-utils'

export default function () {
  // updata cart number
  const options = {
    template: {
      content: 'b3/b3json',
      totals: 'cart/totals',
      pageTitle: 'cart/page-title',
      statusMessages: 'cart/status-messages',
    },
  }

  window.B3Spinner.show()
  stencilUtils.api.cart.getContent(options, (err, response) => {
    window.B3Spinner.hide()
    if (err) return
    const {
      cart,
    } = JSON.parse(response.content) || {}

    const {
      items,
    } = cart

    if (!items) return

    const cartQuantity = items.reduce((result, item) => {
      result += item.quantity
      return result
    }, 0)

    const cartQty = document.querySelector('.cart-quantity')
    cartQty.innerHTML = cartQuantity
    if (cartQuantity > 0) {
      cartQty.classList.add('countPill--positive')
    } else {
      cartQty.classList.remove('countPill--negative')
    }
    if (stencilUtils.tools.storage.localStorageAvailable()) {
      localStorage.setItem('cart-quantity', cartQuantity)
    }
  })
}
