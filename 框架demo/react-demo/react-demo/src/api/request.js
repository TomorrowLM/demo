import axios from 'axios'
import store from '../store'
// import { resetUserInfo } from '../store/actions/users'
// import { storage, snackbar } from '../utils'

const API_BASE_URLS = {
  development: 'http://localhost:3300',
}
console.log(123,process.env.NODE_ENV)
const request = axios.create({
  baseURL: API_BASE_URLS[process.env.NODE_ENV],
})
request.interceptors.request.use((config) => {
console.log(config)
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
