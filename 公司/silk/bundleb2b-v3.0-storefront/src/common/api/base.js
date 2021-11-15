import axios from 'axios'
import Alert from '../utils/Alert'
import themeConfig from '../../themeConfig'
import B3Storage from '../utils/B3Storage'

const b3request = axios.create({
  baseURL: themeConfig.apiBaseUrl,
  timeout: 1000 * 10 * 60 * 5,
})

b3request.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    authToken: B3Storage.B3B2BToken.value,
  }
  if (config.params && config.params.orderBy) {
    config.params = {
      ...config.params,
    }
  }
  return config
})

b3request.interceptors.response.use(resp => {
  const {
    code,
    message,
    data,
  } = resp.data

  const { 
    params: {
      SHOWERROR = true
    } = {}
   } = resp.config

  if (code !== 200) {
    window.B3Spinner.hide()
    SHOWERROR && Alert.error(message)
    return Promise.reject(resp.data)
  }

  return data
})

export default b3request
