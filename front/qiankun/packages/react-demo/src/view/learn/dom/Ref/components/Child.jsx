import React from "react";
import { Button, Input } from "antd";
class Child extends React.Component {
  constructor(props){
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    console.log(this.props)
    return (
      <div>
        <Input ref={this.textInput} />
      </div>
    );
  }
}
export default Child;
