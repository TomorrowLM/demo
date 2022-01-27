import React, { Component } from "react";

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
