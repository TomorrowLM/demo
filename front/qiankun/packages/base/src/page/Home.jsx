import { NavLink, Outlet } from "react-router-dom";

//TODO:这里容器必须设置在父路径上
function Home() {
  return (
    <div className="home" style={{ width: "100vw", height: "100vh" }}>
      这个是qiankun首页
      <div style={{ display: "flex",width: "100vw", height: "100vh" }}>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default Home;
