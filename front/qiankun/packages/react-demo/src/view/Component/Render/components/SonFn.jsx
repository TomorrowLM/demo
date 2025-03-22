import React, { useState } from "react";
import { Button } from "antd";
const SonFn = React.memo(() => {
  console.log("Render: sonFn!");
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  return (
    <>
      我是函数子组件!
      <div>count1:{count1}</div>
      <Button
        onClick={() => {
          setCount1(count1 + 1);
        }}
      >
        点击
      </Button>
      <div>count2:{count2}</div>
      <Button
        onClick={() => {
          setCount2(count2 + 1);
        }}
      >
        点击
      </Button>
    </>
  );
});
export default SonFn;
