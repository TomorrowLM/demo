import stencilUtils from '@bigcommerce/stencil-utils'
import getCart from './getCart'
import Alert from '../utils/Alert'
import triggerCartNumber from './triggerCartNumber'
import * as locales from '../locales'

export default async function () {
  try {
    const data = await getCart()

    if (Array.isArray(data) && data.length > 0) {
      const cartItems = data[0].lineItems.physicalItems.filter(item => item.parentId === null)

      const result = []
      const itemRemove = id => new Promise((resolve, reject) => {
        stencilUtils.api.cart.itemRemove(id, (err, response) => {
          if (response.data.status === 'succeed') resolve()
          else {
            Alert.error(locales.tips.cleareShoppingListFailed)
            reject()
          }
        })
      })

      cartItems.forEach(cartItem => {
        result.push(itemRemove(cartItem.id))
      })

      await Promise.all(result)
      Alert.success(locales.tips.clearedShoppingList)
      triggerCartNumber()
    } else {
      // no cart
      Alert.success(locales.tips.clearedShoppingList)
    }
  } catch {
    Alert.error(locales.tips.globalError)
  }
}
