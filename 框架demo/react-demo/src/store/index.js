import { createStore, applyMiddleware, compose } from 'redux'//applyMiddleware用来合并多个中间件，逗号隔开
import { createLogger } from 'redux-logger'// 调用日志打印方法 collapsed是让action折叠，看着舒服点
import thunk from 'redux-thunk'// //可以在action里传入 dispatch getState
import reducers from './reducers'

function configureStore() {
  const logger = createLogger({})

  const middlewares = [thunk]
  //这里判断项目环境，正式的话打印的
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(logger)
  }

  const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose
  //通过applyMiddleware来结合多个Middleware, 返回一个enhancer；
  const enhancer = composeEnhancers(applyMiddleware(...middlewares))

  return createStore(reducers, enhancer)
}

export default configureStore()
