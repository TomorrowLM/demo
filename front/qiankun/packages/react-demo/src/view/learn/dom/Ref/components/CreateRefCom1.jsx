import React from "react";
import { Button, Input } from "antd";
class CreateRefCom1 extends React.Component {
  constructor(props){
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    return (
      <div>
        <input ref={this.textInput} />
      </div>
    );
  }
}
export default CreateRefCom1;
