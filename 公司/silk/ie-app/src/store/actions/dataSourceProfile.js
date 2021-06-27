export const UPDATE_PROFILE_INFO = 'UPDATE_PROFILE_INFO'
export const RESET_PROFILE_INFO = 'RESET_PROFILE_INFO'

export const updateProfileInfo = (profileInfo) => ({
  type: UPDATE_PROFILE_INFO,
  payload: profileInfo
})

export const resetProfileInfo = () => ({
  type: RESET_PROFILE_INFO
})
