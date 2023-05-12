import React from 'react'
import SonText from './Son-context'
import { Provider } from './context'
class FatherText extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    info: 'info from father',
  }
  render() {
    return (
      <Provider value={this.state.info}>
        <div>
          <p>{this.state.info}</p>
          <SonText />
        </div>
      </Provider>
    )
  }
}
export default FatherText