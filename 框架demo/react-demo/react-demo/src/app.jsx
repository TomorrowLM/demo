import React, { useState } from "react";
import { routes } from "./route/index.js";
import { Route, Link, Switch, Redirect } from "react-router-dom";
import "./css/antd.css";
import "./css/app.css";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  LaptopOutlined,
  NotificationOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import Dashboard from "./view/DashBoard/Dashboard.jsx";
import Second from "./view/Router/second.jsx";
import Router from "./view/Router/index.jsx";
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
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
              <SubMenu key="sub2" icon={<LaptopOutlined />} title="store">
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                  <Link to="/store">Store</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" icon={<NotificationOutlined />} title="Dom">
                <Menu.Item key="3" icon={<DesktopOutlined />}>
                  <Link to="/onRef">OnRef</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<DesktopOutlined />}>
                  <Link to="/findDomDode">FindDomDode</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<DesktopOutlined />}>
                  <Link to="/ref">Ref</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub4"
                icon={<NotificationOutlined />}
                title="Communicate"
              >
                <Menu.Item key="6" icon={<DesktopOutlined />}>
                  <Link to="/communicate">Communicate</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub5"
                icon={<NotificationOutlined />}
                title="ClassHooks"
              >
                <Menu.Item key="7" icon={<DesktopOutlined />}>
                  <Link to="/classHooks">ClassHooks</Link>
                </Menu.Item>
                <Menu.Item key="8" icon={<DesktopOutlined />}>
                  <Link to="/functionHooks">FunctionHooks</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub6"
                icon={<NotificationOutlined />}
                title="特效"
              >
                <Menu.Item key="9" icon={<DesktopOutlined />}>
                  <Link to="/reactSortable">ReactSortable</Link>
                </Menu.Item>
                <Menu.Item key="9" icon={<DesktopOutlined />}>
                  <Link to="/reactSortable">ReactSortable</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub7"
                icon={<NotificationOutlined />}
                title="Router"
              >
                <Menu.Item key="10" icon={<DesktopOutlined />}>
                  <Link to="/router">Router</Link>
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
                overflowY: "auto",
              }}
            >
              <div style={{ width: "100%" }}>
                <Switch>
                  {routes.map(({ path, component, exact }) => {
                    return (
                      <Route
                        key={path}
                        path={"/"+path}
                        component={component}
                        exact={exact}
                      />
                    );
                  })}
                  <Redirect to="/dashboard"  exact/>
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
