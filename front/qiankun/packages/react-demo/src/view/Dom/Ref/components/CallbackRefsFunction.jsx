import React from "react";
import { Button, Input } from "antd";
export default function CallbackRefsFunction(props) {
  const clickButton = () => {
    this.textInput.focus();
  };
  return (
    <div>
      <Input type="text" ref={(el) => (this.textInput = el)} />
      <Input type="button" onClick={clickButton} />
    </div>
  );
}
