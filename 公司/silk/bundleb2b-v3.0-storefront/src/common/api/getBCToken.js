// Get currently logged-in customer's BC token in order to send it to API for verification.
// appClientId: your app's client ID
import axios from 'axios'
import Alert from '../utils/Alert'
import * as locales from '../locales'
import themeConfig from '../../themeConfig'

export default () => new Promise((resolve, reject) => {
  axios
    .get('/customer/current.jwt', {
      params: {
        app_client_id: themeConfig.appClientId,
      },
    })
    .then(response => {
      if (response.status === 200) resolve(response.data.token)
      else reject()
    })
    .catch(() => {
      Alert.error(locales.tips.networkError)
      reject()
    })
})
