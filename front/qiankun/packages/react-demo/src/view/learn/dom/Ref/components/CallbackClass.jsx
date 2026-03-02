import React, { Component } from "react";
import { Button, Input } from "antd";
class CallbackRefs extends Component {
 
  render() {
    return (
      <div>
        <input ref={ this.props.iptRef} type="text" name="iptElmClass"/>
      </div>
    );
  }
}
export default CallbackRefs;
