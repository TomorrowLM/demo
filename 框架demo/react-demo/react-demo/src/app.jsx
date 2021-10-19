import React, { useState } from "react";
import { routes } from "./route/index.js";
import { Route, Link, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./css/antd.css";
import "./css/app.css";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
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
  const [menuWidth, setMenuWidth] = useState(256);
  const { Header, Content, Sider } = Layout;
  const toggleCollapsed = () => {
    if (menuWidth == 256) {
      setMenuWidth("");
    } else {
      setMenuWidth(256);
    }
    console.log(menuWidth);
    console.log(API);
    setCollapsed(!collapsed);
  };
  return (
    <div style={{ width: "100%,", height: "100vh", overflow: "hidden" }}>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<DesktopOutlined />}>
                <Link to="/Dashboard">Dashboard</Link>
              </Menu.Item>
              <SubMenu key="sub2" icon={<LaptopOutlined />} title="store">
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                  <Link to="/store">store</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" icon={<NotificationOutlined />} title="Dom">
                <Menu.Item key="3" icon={<DesktopOutlined />}>
                  <Link to="/onRef">ref</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <div style={{ width: "100%" }}>
                <Switch>
                  {routes.map(({ path, component }) => {
                    return (
                      <Route
                        key={path}
                        path={"/" + path}
                        component={component}
                      />
                    );
                  })}
                </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
        {/* <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{ marginBottom: 16 }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
          )}
        </Button> */}
      </Layout>
    </div>
  );
}
