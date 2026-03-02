import React, { useRef, useImperativeHandle } from "react";
import { Button, Input } from "antd";
const InputCom = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  // 暴露出去的实例对象应该有哪些函数
  useImperativeHandle(ref, () => ({
    consoleFN: () => {
      console.log("InputCom:ref", props, ref);
    },
    focus: () => {
      inputRef.current.focus();
    },
  }));

  return <Input type="text" ref={inputRef} {...props} />;
});
export default InputCom;
