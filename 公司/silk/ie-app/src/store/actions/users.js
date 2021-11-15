export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
export const RESET_USER_INFO = 'RESET_USER_INFO'

export const updateUserInfo = (userInfo) => ({
  type: UPDATE_USER_INFO,
  payload: userInfo
})

export const resetUserInfo = () => ({
  type: RESET_USER_INFO
})
