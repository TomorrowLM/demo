import React, { useState, lazy, Suspense } from "react";
import { routes } from "@/route/index";
import { Link } from "react-router-dom";
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
  // 生成menu dom
  const subTitle = [];
  let subIndex = 1;
  let router = routes[1]["children"].map((value, index) => {
    subTitle.push(value.name);
    if (value.isMenu === 1 && !value.children) {
      return [value];
    } else if (value.isMenu === 1 && value.children) {
      return value.children;
    }
  });
  router = router.filter((value) => value);
  const routerDom = router.map((routerVal, index) => {
    subIndex = subIndex + 1;
    return routerVal.length === 1 ?
      <Menu.Item key={`${routerVal[0].path}`} icon={routerVal[0].icon}>
        <Link to={routerVal[0].path}>{routerVal[0].name}</Link>
      </Menu.Item> : (
        <SubMenu
          key={'sub' + `${routerVal[0].path}`}
          icon={<LaptopOutlined />}
          title={subTitle[subIndex - 2]}
        >
          {routerVal.map((menuVal) => {
            return (
              <Menu.Item key={`${menuVal.path}`} icon={menuVal.icon}>
                <Link to={menuVal.path}>{menuVal.name}</Link>
              </Menu.Item>
            );
          })}
        </SubMenu>
      );
  });
  const branch = window.location.hash.replace(/#\//, "").split("/");
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
              <div style={{ width: "100%" }}>
                {props.children}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}
