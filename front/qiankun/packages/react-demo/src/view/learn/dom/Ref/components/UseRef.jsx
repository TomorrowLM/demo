import React, { useRef } from "react";
import { Button, Input } from "antd";
import InputCom from "./InputCom";
export default function UseRef(props) {
  let inputRef1 = useRef(null);
  const handleClick1 = () => {
    inputRef1.current.focus();
  };
  let inputRef2 = useRef(null);
  const handleClick2 = () => {
    inputRef2.current.consoleFN();
    inputRef2.current.focus();
  };
  React.useEffect(() => {
    console.log("========== useRef ==========");
    console.log("获取元素实例：当 ref 属性用于 HTML 元素时", inputRef1.current);
    console.log(
      "获取元素实例：当 ref 属性用于自定义函数组件时",
      inputRef2.current,
    );
  });
  return (
    <div>
      <div>
        <h4>获取元素实例：当 ref 属性用于 HTML 元素时</h4>
        <input type="text" ref={inputRef1} />
        <Button onClick={handleClick1}>Click</Button>
      </div>
      <div>
        <h4>获取元素实例：当 ref 属性用于自定义函数组件时</h4>
        {/* 将inputRef2通过forwardRef转发到Input组件中的input */}
        <InputCom ref={inputRef2}></InputCom>
        <Button onClick={handleClick2}>Click</Button>
      </div>
    </div>
  );
}
