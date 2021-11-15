import { storage } from '../../utils'
import { UPDATE_USER_INFO, RESET_USER_INFO } from '../actions/users'

const initState = {
  userInfo: storage.userInfo.val ?? {
    userPermsCode: [],
    authToken: '',
    roles: [],
    username: '',
    email: '',
    userId: ''
  }
}

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_USER_INFO:
      return {
        ...state,
        userInfo: {
          userPermsCode: [],
          authToken: '',
          roles: [],
          username: '',
          email: '',
          userId: ''
        }
      }
    case UPDATE_USER_INFO:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload
        }
      }
    default:
      return state
  }
}
