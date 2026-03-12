import React, { useState, useEffect } from "react";
import { useUpdateEffect } from "ahooks";
import { Button } from "antd";
import LmCard from "@/components/Lm-card";

const UseEffect: React.FC = () => {
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    console.log("useEffect", count);
  }, [count]);

  useUpdateEffect(() => {
    console.log("useUpdateEffect", count);
  }, [count]);

  return <div>
    <LmCard title="useEffect" type="theory">
      useEffect在初始化的时候会首次执行
      useUpdateEffect 用法等同于 useEffect，但是会忽略首次执行，只在依赖更新时执行。
      <p>You clicked {count} times</p>
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
    </LmCard>
  </div>;
}

export default UseEffect