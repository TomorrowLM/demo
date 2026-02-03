import React, { createRef, useEffect, useState, useRef } from "react";
import { Button, Input } from "antd";
const UseRefAlert = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const latestCount = useRef(count2);
  useEffect(() => {
    latestCount.current = count2;
  });
  function handleAlert1() {
    setTimeout(() => {
      alert("you click on " + count1);
    }, 1000);
  }
  function handleAlert2() {
    setTimeout(() => {
      alert("you click on " + latestCount.current);
    }, 1000);
  }
  return (
    <div>
      <div>
        {/* alert 不是界面上 count 的实时状态 */}
        点击按钮后，1 秒后弹出 alert，在1s内多次点击，alert
        弹出的是点击alert时的 count 值。
        <p>you clicked {count1}</p>
        <Button
          onClick={() => {
            setCount1(count1 + 1);
          }}
        >
          click me
        </Button>
        <Button onClick={handleAlert1}>alert</Button>
      </div>
      <div>
        <p>you clicked {count2}</p>
        <Button
          onClick={() => {
            setCount2(count2 + 1);
          }}
        >
          click me
        </Button>
        <Button onClick={handleAlert2}>alert</Button>
      </div>
    </div>
  );
};

export default UseRefAlert;
