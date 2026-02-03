import React,{useContext} from 'react'
import GrandSon from './GrandSon-context'
import { Consumer } from './context'
class SonText extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Consumer>
        {(info) => (
          // 通过Consumer直接获取父组件的值
          <div>
            <p>我是子组件这是父组件传递的值:{info}</p>
            <GrandSon></GrandSon>
          </div>  
        )}
      </Consumer>
    )
  }
}
export default SonText