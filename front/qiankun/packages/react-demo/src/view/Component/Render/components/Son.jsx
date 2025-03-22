import React from "react";
import { Input } from "antd";
class Son extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log("Constructor: son!");
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (e) => {};
  componentDidMount() {
    console.log("son Component did mount!");
  }
  render() {
    console.log("Render: son!");
    return (
      <div>
        我是类子组件
        <Input type="text" onChange={this.handleChange} />
      </div>
    );
  }
}

export default Son;
