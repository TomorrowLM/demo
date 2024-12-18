import React, { createRef, useEffect, useState, useRef } from "react";

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
        <p>you clicked {count1}</p>
        <button
          onClick={() => {
            setCount1(count1 + 1);
          }}
        >
          click me
        </button>
        <button onClick={handleAlert1}>alert</button>
      </div>
      <div>
        <p>you clicked {count2}</p>
        <button
          onClick={() => {
            setCount2(count2 + 1);
          }}
        >
          click me
        </button>
        <button onClick={handleAlert2}>alert</button>
      </div>
    </div>
  );
};

export default UseRefAlert;
