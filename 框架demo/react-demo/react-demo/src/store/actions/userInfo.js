/**
 * action:数据更新的指令，它会告诉reduce如何去处理数据
 */

export const userInfo = (info) => {
  return ({
    type: 'userInfo',
    info
  })
}
