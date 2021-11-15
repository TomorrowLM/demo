import axios from 'axios'
import getCart from './getCart'
import triggerCartNumber from './triggerCartNumber'

export default async function (data) {
  const res = await getCart()
  const url = res[0] ? `/api/storefront/carts/${res[0].id}/items` : '/api/storefront/carts'

  await axios.post(url, data)
  triggerCartNumber()
}
