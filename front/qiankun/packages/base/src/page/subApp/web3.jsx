import { Outlet } from "react-router-dom";

function Web3() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Outlet></Outlet>
      <div id="vue3-container" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
}

export default Web3;
