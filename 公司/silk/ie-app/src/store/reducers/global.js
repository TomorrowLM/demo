import { storage } from '../../utils'
import { SET_GLOBAL_LOADING } from '../actions/global'

const initState = {
  lang: storage.lang.val ?? 'en',
  isGlobalLoading: false
}

export default (state = initState, action) => {
  switch (action.type) {
    case SET_GLOBAL_LOADING:
      return {
        ...state,
        isGlobalLoading: action.payload.isLoading
      }
    default:
      return state
  }
}
