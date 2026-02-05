import React, { useState } from "react";
import { menuRoutes } from "@/route/index";
import { Link, Outlet } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Spin } from "antd";
import { LaptopOutlined } from "@ant-design/icons";
import HomeNav from "@/view/layout/Nav";

export default function App(props) {
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
  const buildMenuItems = (router, parentPath = "") => {
    return router.map((routerVal) => {
      const fullPath = `${parentPath}${routerVal.path || ""}`;
      console.log(fullPath, GLOBAL_INFO.APP_ROUTER_BASE, "fullPath");

      if (!routerVal?.children?.length) {
        return {
          key: fullPath,
          icon: routerVal.icon,
          label: <Link to={fullPath}>{routerVal.name}</Link>,
        };
      }

      const groupKey = routerVal.path
        ? fullPath
        : `group-${parentPath}-${routerVal.name}`;

      return {
        key: groupKey,
        icon: <LaptopOutlined />,
        label: routerVal.name,
        children: buildMenuItems(routerVal.children, fullPath),
      };
    });
  };

  const menuItems = buildMenuItems(menuRoutes, GLOBAL_INFO.APP_ROUTER_BASE);
  // const branch = window.location.hash.replace(/#\//, "").split("/");
  const branch = window.location.pathname
    .replace(/\//, "")
    .split("/")
    .splice(1);
  console.log(props, branch, "props.children");
  return (
    <div className="bbb">
      <Layout style={{ height: "100%", overflow: "hidden" }}>
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
            <Menu mode="inline" items={menuItems} />
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Breadcrumb
              style={{ margin: "16px 0" }}
              items={branch.map((value, index) => ({
                title: value,
                key: `${index}-${value}`,
              }))}
            />
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
