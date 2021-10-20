import React, { Component } from "react";

class CallbackRefs extends Component {
  constructor(props) {
    super(props);
    this.inputElementRef = this.inputElementRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  inputElementRef(inputElement) {
    this.inputRef = inputElement;
  }
  handleClick() {
    this.inputRef.focus();
  }
  render() {
    return (
      <div>
        回调 Refs :
        <br />
        <input type="text" ref={this.inputElementRef} />
        <button onClick={this.handleClick}>Click</button>
      </div>
    );
  }
}

export default CallbackRefs;
