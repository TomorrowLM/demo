import React, { useState } from "react";
import { routes } from "./route/index.js";
import { Route, Link, Switch, Redirect } from "react-router-dom";
import "./css/antd.css";
import "./css/app.css";
import { Layout, Menu, Breadcrumb, Input } from "antd";
import { LaptopOutlined, DesktopOutlined } from "@ant-design/icons";
import HomeNav from "./components/HomePage/Nav.jsx";

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
    setCollapsed(!collapsed);
  };
  const router = [
    [{ name: "dashboard", path: "dashboard", icon: <DesktopOutlined /> }],
    [
      { name: "store", path: "store", icon: <DesktopOutlined /> },
      { name: "hox", path: "hox", icon: <DesktopOutlined /> },
    ],
    [
      { name: "onRef", path: "onRef", icon: <DesktopOutlined /> },
      { name: "findDomDode", path: "findDomDode", icon: <DesktopOutlined /> },
      { name: "ref", path: "ref", icon: <DesktopOutlined /> },
    ],
    [{ name: "communicate", path: "communicate", icon: <DesktopOutlined /> }],
    [
      { name: "ClassHooks", path: "ClassHooks", icon: <DesktopOutlined /> },
      {
        name: "functionHooks",
        path: "functionHooks",
        icon: <DesktopOutlined />,
      },
      { name: "ahooks", path: "ahooks", icon: <DesktopOutlined /> },
    ],
    [
      {
        name: "reactSortable",
        path: "reactSortable",
        icon: <DesktopOutlined />,
      },
    ],
    [{ name: "路由", path: "Router", icon: <DesktopOutlined /> }],
  ];
  const subTitle = ["store", "Dom", "Communicate", "Hooks", "特效", "Router"];
  let keyIndex = 1;
  let subIndex = 1;
  const routerDom = router.map((subVal, index) => {
    if (index == 0) {
      return (
        <Menu.Item key={index + 1} icon={subVal[0].icon}>
          <Link to={"/" + subVal[0].path}>{subVal[0].name}</Link>
        </Menu.Item>
      );
    }
    subIndex = subIndex + 1;
    return (
      <SubMenu
        key={"sub" + subIndex}
        icon={<LaptopOutlined />}
        title={subTitle[subIndex - 2]}
      >
        {subVal.map((menuVal, menuIndex) => {
          keyIndex = keyIndex + 1;
          return (
            <Menu.Item key={keyIndex} icon={menuVal.icon}>
              <Link to={"/" + menuVal.path}>{menuVal.name}</Link>
            </Menu.Item>
          );
        })}
      </SubMenu>
    );
  });
  console.log(2);
  return (
    <div style={{ width: "100%,", height: "100vh", overflow: "hidden" }}>
      <Layout>
        <Header>
          <HomeNav />
        </Header>

        <Layout>
          <Sider
            width={200}
            className="site-layout-background"
            collapsible
            onCollapse={toggleCollapsed}
            theme={"light"}
          >
            {/* <div style={{ textAlign: "center" }} className="search">
              <Input style={{ width: "100px" }} />
            </div> */}
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
            >
              {routerDom}
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
                        path={"/" + path}
                        component={component}
                        exact={exact}
                      />
                    );
                  })}
                  <Redirect to="/dashboard" exact />
                </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}
