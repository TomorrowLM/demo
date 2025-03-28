import React, { Component } from "react";
import Son from "./Son.jsx";

class Father extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    info: "",
  };
  callback = (value) => {
    // 此处的value便是子组件带回
    this.setState({
      info: value,
    });
  };

  render() {
    return (
      <div>
        <h1>我是父组件</h1>
        <p>父组件获取子组件数据：{this.state.info}</p>
        <Son callback={this.callback} />
      </div>
    );
  }
}
export default Father;
