export const SET_GLOBAL_LOADING = 'SET_GLOBAL_LOADING'

export const setGlobalLoading = (isLoading) => ({
  type: SET_GLOBAL_LOADING,
  payload: {
    isLoading
  }
})
