import { useSetState } from "ahooks";
import React from "react";

export default class CreateRefCom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  click() {
    this.setState({ count: this.state.count + 1 });
  }
  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        我是子组件 我被父组件点击：{this.state.count}
      </div>
    );
  }
}
