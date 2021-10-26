import React, { useState } from "react";

function functionHooks() {
  function getInitState() {
    return { number: 5 };
  }
  let [counter, setCounter] = useState(getInitState);
  return (
    <div>
      <div>
        <h1>useState</h1>
        <p>{counter.number}</p>
        <button onClick={() => setCounter({ number: counter.number + 1 })}>
          +
        </button>
        <button onClick={() => setCounter(counter)}>setCounter</button>
      </div>
    </div>
  );
}

export default functionHooks;
