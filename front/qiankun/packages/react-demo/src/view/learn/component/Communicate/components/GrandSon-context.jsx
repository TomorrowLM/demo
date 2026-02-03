import React from 'react'
import { Consumer } from './context'
class GrandSon extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Consumer>
        {(info) => (
          // 通过 Consumer 中可以直接获取组父组件的值
          <div>
            <p>我是孙子组件这是爷爷组件传递的值:{info}</p>
          </div>
        )}
      </Consumer>
    )
  }
}
export default GrandSon
