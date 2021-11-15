import {
  UPDATE_PROFILE_INFO,
  RESET_PROFILE_INFO
} from '../actions/dataSourceProfile'

const initState = {
  profileInfo: {
    profileName: '',
    sourceName: '',
    autoAttributeMappingField: 0,
    sourceFileType: 0,
    fileUrl: '',
    matchedAttributesNums: 0,
    attributeMapping: [],
    connectionId: '',
    connectionName: '',
    channelName: ''
  }
}

export default (state = initState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_INFO:
      return {
        ...state,
        profileInfo: {
          ...state.profileInfo,
          ...action.payload
        }
      }
    case RESET_PROFILE_INFO:
      return {
        ...state,
        profileInfo: {
          profileName: '',
          sourceName: '',
          autoAttributeMappingField: 0,
          sourceFileType: 0,
          fileUrl: '',
          matchedAttributesNums: 0,
          attributeMapping: [],
          connectionId: '',
          connectionName: '',
          channelName: ''
        }
      }
    default:
      return state
  }
}
