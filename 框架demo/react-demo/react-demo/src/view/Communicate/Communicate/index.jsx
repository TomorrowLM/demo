import Father from "./components/Father";
import FatherText from "./components/Father-context";
import React from "react";
const Communicate = function (props) {
  
  return (
    <div>
      <div>
        <div>
          <h1>1.子组件传父组件</h1>
          <Father></Father>
        </div>
        <div>
          <h1>2.Context:适用于跨层级组件之间通信</h1>
          <FatherText></FatherText>
        </div>
      </div>
    </div>
  );
};
export default Communicate;
