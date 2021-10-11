// 父组件
import React from 'react'
import Son from './son'
import { Button } from 'antd'

class Father extends React.Component {
  constructor(props) {
    super(props)
  }
  sonRef = (ref) => {
    this.child = ref // 在这里拿到子组件的实例
  }
  clearSonInput = () => {
    this.child.clearInput()
  }
  render() {
    return (
      <div>
        <Son onRef={this.sonRef} />
        <Button type='primary' onClick={this.clearSonInput}>
          清空子组件的input
        </Button>
      </div>
    )
  }
}
export default Father