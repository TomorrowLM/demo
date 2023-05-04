/**
 * reducer：处理数据的方法，可以帮助store完成对数据的各种操作
 */
import { combineReducers } from 'redux'
import counter from './counter'
import userInfo from './userInfo'

export default combineReducers({
	counter,
	userInfo
})