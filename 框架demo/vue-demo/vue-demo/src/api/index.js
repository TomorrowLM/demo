import axios from '@/utils/request'

export const userInfo = (param) => {
  return axios.get('users')
}