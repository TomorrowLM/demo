import { Button, Typography, Divider, Space } from "antd";
import React, { useEffect, useState } from "react";
import ReactDOM, { unstable_batchedUpdates, flushSync } from "react-dom";

const { Title, Text } = Typography;
function functionHooks() {
  /**
   * usestate
   */
  const [count1, setCount1] = useState(0);
  const [flag, setFlag] = useState(false);
  function handleClick() {
    setCount1(count1 + 1);
    setCount1(count1 + 1);
    setFlag((f) => !f);
    // React 只会在最后重新渲染一次（这是批处理！）
  }
  function handleClick1() {
    //使用函数式更新
    setCount1((c) => c + 1);
    console.log(count1);
    setCount1((c) => c + 1);
    console.log(count1);
    // React 只会在最后重新渲染一次（这是批处理！）
  }
  function handleClick2() {
    // 模拟一个异步操作，真实业务里面可能是网络请求等
    setTimeout(() => {
      setCount1(count1 + 1);
      console.log(count1);
      setFlag((f) => !f);
      // React18之前 会渲染两次，React 18还是会批处理
    }, 10);
  }

  function handleClick3() {
    // 手动批处理
    setTimeout(() => {
      unstable_batchedUpdates(() => {
        setCount1(count1 + 1);
        console.log(count1);
        setFlag((f) => !f);
      });
    }, 10);
    // React 只会在最后重新渲染一次（这是批处理！）
  }

  function handleClick4() {
    flushSync(() => {
      setCount1(count1 + 1);
    });
    flushSync(() => {
      setFlag((f) => !f);
    });
    // React 会渲染两次
  }
  useEffect(() => {
    console.log("渲染");
  });
  /**
   * useReducer
   */
  return (
    <div>
      <div>
        <Title level={4}>批量处理batchUpdate</Title>
        <div>
          <p style={{ color: flag ? "blue" : "black" }}>{count1}</p>
          <Space>
            <Button onClick={handleClick}> 基础 </Button>
            <Button onClick={handleClick1}> 函数式更新 </Button>
            <Button onClick={handleClick2}>setTimeout</Button>
            <Button onClick={handleClick3}>
              unstable_batchedUpdates手动批处理
            </Button>
            <Button onClick={handleClick4}>flushSync</Button>
          </Space>
        </div>
        <Divider />
      </div>
    </div>
  );
}

export default functionHooks;
