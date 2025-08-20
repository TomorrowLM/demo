import { NavLink, Outlet } from "react-router-dom";
import React from "react";
import { loadMicroApp } from "qiankun"; //TODO:这里容器必须设置在父路径上
import styles from "./qiankun.module.less";

class Qiankun extends React.Component {
  containerRef = React.createRef();
  microApp = null;
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    localStorage.setItem("appCommuicate", "我是主应用传递的值");
    console.log("在main中设置了appCommuicate");
    // console.log(this.containerRef.current, 123123);
    // this.microApp = loadMicroApp({
    //   name: "vue3",
    //   entry: "http://localhost:8003",
    //   // container: this.containerRef.current,
    //   container: "#vue3-container-1",
    //   props: { to: "/qiankun-vue3-page" },
    // });
    // console.log(this.microApp, 12);
  }
  // componentWillUnmount() {
  //   this.microApp.unmount();
  // }

  componentDidUpdate() {
    // this.microApp.update({ name: "vue3" });
  }
  render() {
    return (
      <div style={{ width: "100%" }}>
        <h1>我是主应用</h1>
        {/* <div
          style={{ width: "100%" }}
          id="vue3-container-1"
          ref={this.containerRef}
        ></div> */}
        <h2>demo1:样式隔离</h2>
        <p className={styles["base-app-color"]}>这里我应用了当前应用的class</p>
        <p class={"vue3-app-color"}>这里我应用了子应用的class</p>
      </div>
    );
  }
}
export default Qiankun;
