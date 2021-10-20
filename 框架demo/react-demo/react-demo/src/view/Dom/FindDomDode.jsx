import React from "react";
import ReactDOM from "react-dom";
const FindDomDode = function (props) {
  const handleGetDom = () => {
    let title = document.querySelector("#title");
    ReactDOM.findDOMNode(title).style.background = "green";
  };
  return (
    <div>
      <h1 id="title">测试节点</h1>
      <button onClick={handleGetDom}>点击操作Dom</button>
    </div>
  );
};
export default FindDomDode;
