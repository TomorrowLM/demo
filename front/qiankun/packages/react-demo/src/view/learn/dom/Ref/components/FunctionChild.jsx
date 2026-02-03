import React from "react";
import InputCom from "./Input";
import { Button } from "antd";
export default function FunctionChild() {
  // textInput 必须被声明在这里——ref才能适用于它
  let textInput = React.createRef();
  const handleClick = () => {
    console.log(textInput, textInput.current);
    textInput.current.focus();
  };
  return (
    <div>
      <InputCom type="text" ref={textInput} />
      <Button onClick={handleClick}>获取ref</Button>
    </div>
  );
}
