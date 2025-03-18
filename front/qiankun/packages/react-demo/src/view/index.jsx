import React, { useState, lazy, Suspense } from "react";
import { menuRoutes } from "@/route/index";
import { Link, Outlet } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Spin } from "antd";
import { LaptopOutlined } from "@ant-design/icons";
import HomeNav from "@/components/HomePage/Nav";

export default function App(props) {
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
  const routerDomCreate = (router) => {
    return router.map((routerVal, index) => {
      // subIndex = subIndex + 1;
      console.log(routerVal, 11);
      return !routerVal?.children?.length ? (
        <Menu.Item key={`${routerVal.path}`} icon={routerVal.icon}>
          <Link to={routerVal.path}>{routerVal.name}</Link>
        </Menu.Item>
      ) : (
        <SubMenu
          key={"sub" + `${routerVal.name}`}
          icon={<LaptopOutlined />}
          title={routerVal.name}
        >
          {routerDomCreate(routerVal.children)}
        </SubMenu>
      );
    });
  };
  const routerDom = routerDomCreate(menuRoutes);
  const branch = window.location.hash.replace(/#\//, "").split("/");
  console.log(props, "props.children");
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
              {branch.map((value, index) => {
                return <Breadcrumb.Item key={index}>{value}</Breadcrumb.Item>;
              })}
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                overflowY: "auto",
              }}
            >
              <div style={{ width: "100%" }}>{props.children}</div>
              {/* <Outlet></Outlet> */}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}
