import { combineReducers } from 'redux'

import users from './users'
import global from './global'
import dataSourceProfile from './dataSourceProfile'

export default combineReducers({
  users,
  global,
  dataSourceProfile
})
