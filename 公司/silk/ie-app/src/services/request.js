import axios from 'axios'
import store from '../store'
import { resetUserInfo } from '../store/actions/users'
import { storage, snackbar } from '../utils'

const API_BASE_URLS = {
  mock: 'https://dev.bundleb2b.net/apidoc-server/app/mock/32',
  development: 'https://ie-dev.bundleb2b.net',
  staging: 'https://ie.bundleb2b.net',
  production: 'https://ie.silksoftware.com'
}

const request = axios.create({
  baseURL: API_BASE_URLS[process.env.REACT_APP_MODE]
})

const getAuthToken = () => store.getState().users.userInfo.authToken

request.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    authToken: getAuthToken()
  }
  return config
})

request.interceptors.response.use((resp) => {
  const { errorCode, data } = resp.data

  if (errorCode !== 0) {
    snackbar.error(data.errMsg)
  }

  if (errorCode === 21) {
    store.dispatch(resetUserInfo())
    storage.userInfo.remove()
  }

  return data
})

export default request
