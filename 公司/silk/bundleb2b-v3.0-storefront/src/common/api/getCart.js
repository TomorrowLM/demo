import axios from 'axios'
import Alert from '../utils/Alert'
import * as locales from '../locales'

export default () => new Promise((resolve, reject) => {
  axios
    .get('/api/storefront/carts')
    .then(response => {
      if (response.status === 200) resolve(response.data)
      else reject(response)
    })
    .catch(() => {
      Alert.error(locales.tips.networkError)
      reject()
    })
})
