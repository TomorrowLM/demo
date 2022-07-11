//可以认为是 store 的计算属性
const user = {
  userInfo: state => state.user.userInfo,
  role: state => state.user.role,
}

const permission = {
  addRoutes: state => state.permission.addRoutes,
  routes: state => {
    return state.permission.routes
  },
}

const getters = {
  ...user,
  ...permission
}

export default getters
