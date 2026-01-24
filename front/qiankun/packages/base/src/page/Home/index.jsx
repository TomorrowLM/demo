import { NavLink, Outlet } from "react-router-dom";
//TODO:这里容器必须设置在父路径上
function Home() {
  return (
    <div className="qiankun-app">
      <div className="d-flex qiankun-header">
        <NavLink to="/"> qiankun 主应用</NavLink>
        <div className="float-right">
          <NavLink to="/qiankun/vue3/qiankun-vue3-page">qiankun-use</NavLink>
          <NavLink className="ml-8" to="/qiankun/vue2-pc">
            vue2-pc
          </NavLink>
          <NavLink className="ml-8" to="/qiankun/vue2-mobile">
            vue2-mobile
          </NavLink>
          <NavLink className="ml-8" to="/qiankun/vue3">
            vue3
          </NavLink>
          <NavLink className="ml-8" to="/qiankun/react">
            react
          </NavLink>
        </div>
      </div>
      <div className="sub_app">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default Home;
