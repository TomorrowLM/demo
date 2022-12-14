import { useState } from "react";
import { createModel } from "hox";

function useCounter() {
  const [countHox, setCount] = useState(0);
  const decrement = () => setCount(countHox - 1);
  const increment = () => setCount(countHox + 1);
  return {
    countHox,
    decrement,
    increment
  };
}
useCounter.namespace = 'useCounter' // 这里需要给每一个 model 都添加命名空间标识
export default createModel(useCounter);