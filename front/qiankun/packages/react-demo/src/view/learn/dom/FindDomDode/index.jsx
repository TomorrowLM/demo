import React from "react";
import ReactDom from "react-dom";
import { Typography, Button } from "antd";

const { Title, Text } = Typography;
const FindDomDode = function (props) {
  const handleGetDom = () => {
    let title = document.querySelector("#title");
    ReactDom.findDOMNode(title).style.background = "green";
  };
  return (
    <div>
      <p id="title">测试节点</p>
      <Button onClick={handleGetDom}>点击操作Dom</Button>
    </div>
  );
};
export default FindDomDode;
