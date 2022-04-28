//可以认为是 store 的计算属性
const user = {
  userInfo: state => state.user.userInfo,
}

const getters = {
  ...user,
}

export default getters
