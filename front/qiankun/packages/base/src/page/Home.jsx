import { NavLink, Outlet } from "react-router-dom";

//TODO:这里容器必须设置在父路径上
function Home() {
  return (
    <div className="home" style={{ width: "100vw", height: "100vh" }}>
      <div style={{ display: "flex",width: "100vw", height: "100vh" }}>
        <Outlet></Outlet>
      </div>
      {/* <div id="vue2-mobile" style={{ width: "100%", height: "100%" }}></div>
      <div id="vue2-pc" style={{ width: "100%", height: "100%" }}></div> */}
    </div>
  );
}

export default Home;
