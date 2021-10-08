import React, { useState } from "react";
import { routes } from "./route/index.js";
import { Route, Link, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { Menu, Button } from "antd";
import "./css/antd.css";
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from "@ant-design/icons";
export default function App() {
  const { SubMenu } = Menu;
  const [collapsed, setCollapsed] = useState(false);
  const [ menuWidth, setMenuWidth] = useState(256);
  const toggleCollapsed = () => {
    if(menuWidth==256){
      setMenuWidth('')
    }else{
      setMenuWidth(256)
    }
    console.log(menuWidth)
    console.log(API)
    setCollapsed(!collapsed);
  };
  
  return (
    <div style={{ width: "100%,", height: "100vh", overflow: "hidden" }}>
      <div
        className="header"
        style={{ width: "100%", height: "50px", backgroundColor: "#123" }}
      >
        <h1 style={{ color: "white" }}>test</h1>
      </div>
      <div className="menu">
        <div style={{ width: menuWidth, backgroundColor: "#001529" }}>
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
          >
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              <Link to="/Dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              <Link to="/store">store</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ContainerOutlined />}>
              Option 3
            </Menu.Item>
            <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              icon={<AppstoreOutlined />}
              title="Navigation Two"
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>
          <Button
            type="primary"
            onClick={toggleCollapsed}
            style={{ marginBottom: 16 }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
            )}
          </Button>
        </div>
        <div style={{ width: "100%" }}>
          <Switch>
            {routes.map(({ path, component }) => {
              return (
                <Route key={path} path={"/" + path} component={component} />
              );
            })}
          </Switch>
        </div>
      </div>
    </div>
  );
}
