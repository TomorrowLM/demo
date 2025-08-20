import { NavLink, Outlet } from "react-router-dom";
import { useEffect } from "react";
import "./Home.css";
function Web1() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div id="vue2-pc" style={{ width: "100%", height: "100%" }}></div>
      {/* <div className="qiankun-app1" style={{ width: "100%", height: "500px" }}>
        <Outlet></Outlet>
      </div>
      <Outlet></Outlet> */}
    </div>
  );
}

export default Web1;