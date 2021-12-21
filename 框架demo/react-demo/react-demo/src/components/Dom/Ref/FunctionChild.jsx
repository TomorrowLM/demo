import React from "react";
import Input from "./Input"
export default function FunctionChild() {
  // textInput 必须被声明在这里——ref才能适用于它
  let textInput = React.createRef();
  const handleClick = () => {
    textInput.current.focus();
    console.log(textInput,textInput.current.value)
  }
  return (
    <div>
      <Input type="text" ref={textInput} />
      <input type="button" value="Focus the text input" onClick={handleClick} />
    </div>
  );
}

