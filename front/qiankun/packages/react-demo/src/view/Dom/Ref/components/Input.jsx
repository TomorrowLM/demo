import React, { useRef, useImperativeHandle } from "react";
import { Button, Input } from "antd";
const InputCom = React.forwardRef((props, ref) => {
  // 暴露出去的实例对象应该有哪些函数
//   useImperativeHandle(ref, () => ({
//     saveMd: () => {
//       console.log("保存markdown内容");
//       localStorage.setItem("notes", htmlString);
//     },
//   }));
  return <Input type="text" ref={ref} {...props} />;
});
export default InputCom;
