import { Button, Typography, Divider } from "antd";
import React, { useState } from "react";
import ReactDOM, { unstable_batchedUpdates } from "react-dom";

const { Title, Text } = Typography;
function functionHooks() {
  const [counter, setCounter] = useState(getInitState);
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  function getInitState() {
    return { number: 5 };
  }
  function handleClick1() {
    //同一个点击事件中有两个状态更新，React 总是将它们分批处理到一个重新渲染中
    setCount((c) => c + 1); // 不重新渲染
    setCount((c) => c + 1); // 不重新渲染
    setFlag((f) => !f); // 还没有重新渲染
    // React 只会在最后重新渲染一次（这是批处理！）
  }
  function handleClick2() {
    // 模拟一个异步操作，真实业务里面可能是网络请求等
    setTimeout(() => {
      //同一个点击事件中有两个状态更新，React 总是将它们分批处理到一个重新渲染中
      setCount((c) => c + 1); // 不重新渲染
      setCount((c) => c + 1); // 不重新渲染
      setFlag((f) => !f); // 还没有重新渲染
      // React 只会在最后重新渲染一次（这是批处理！）
    }, 0);
  }
  function handleClick3() {
    // 模拟一个异步操作，真实业务里面可能是网络请求等
    setTimeout(
      unstable_batchedUpdates(() => {
        setCount((c) => c + 1); // 不重新渲染
        setFlag((f) => !f); // 还没有重新渲染
      }),
      0
    );
  }
  return (
    <div>
      <div>
        <Title level={4}>useState</Title>
        <p>{counter.number}</p>
        <Button onClick={() => setCounter({ number: counter.number + 1 })}>
          +1
        </Button>
        <Divider />
        <Title level={4}>批量处理batchUpdate</Title>
        <div>
          <h1 style={{ color: flag ? "blue" : "black" }}> {count} </h1>
          <Button onClick={handleClick1}> 同步的 setState 两次 </Button>
          <Button onClick={handleClick2}>
            在一个异步的事件循环里 setState 两次
          </Button>
          <Button onClick={handleClick3}>
            在一个异步的事件循环里 setState 两次, 但是使用
            ReactDOM.unstable_batchedUpdates 强制 batch
          </Button>
        </div>
      </div>
    </div>
  );
}

export default functionHooks;
