import React, { useRef } from "react";
import { Button, Input } from "antd";
import InputCom from "./Input";
export default function UseRef(props) {
  let inputRef1 = useRef(null);
  const handleClick1 = () => {
    inputRef1.current.focus();
  };
  let inputRef2 = useRef(null);
  const handleClick2 = () => {
    inputRef2.current.focus();
  };
  return (
    <div>
      <div>
        <h1>当 ref 属性用于 HTML 元素时</h1>
        <Input type="text" ref={inputRef1} />
        <Button onClick={handleClick1}>Click</Button>
      </div>
      <div>
        <h1>函数式组件内部中使用useRef属性,并使用forwardRef转发ref</h1>
        {/* 将inputRef2通过forwardRef转发到Input组件中的input */}
        <InputCom ref={inputRef2}></InputCom>
        <Button onClick={handleClick2}>Click</Button>
      </div>
    </div>
  );
}
