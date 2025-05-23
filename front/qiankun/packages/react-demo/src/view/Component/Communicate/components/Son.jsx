import React from 'react'
class Son extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange = (e) => {
    // 在此处将参数带回
    this.props.callback(e.target.value)
  }
  render() {
    return (
      <div>
        <h1>我是子组件</h1>
        <input type='text' onChange={this.handleChange} />
      </div>
    )
  }
}
export default Son