import service from '@/utils/request'

export const userInfo = () => {
  service.get('users')
}