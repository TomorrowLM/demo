import React, { useState, lazy, Suspense } from "react";
import { routes } from "./route/index.js";
import { Route, Link, Switch } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from "antd";
import { LaptopOutlined } from "@ant-design/icons";
import HomeNav from "./components/HomePage/Nav.jsx";
import "./global.less";
// import { matchRoutes } from "react-router-config";
import { matchRoutes } from "./utils";

export default function App() {
  const { SubMenu } = Menu;
  const [collapsed, setCollapsed] = useState(false);
  const [menuWidth, setMenuWidth] = useState(256);
  const { Header, Content, Sider } = Layout;
  // const { path } = route;
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
  let keyIndex = 1;
  let subIndex = 1;
  let router = routes.map((value, index) => {
    if (value.isMenu === 1 && !value.children) {
      return [value];
    } else if (value.isMenu === 1 && value.children) {
      subTitle.push(value.name);
      return value.children;
    }
  });
  router = router.filter((value) => value);
  const routerDom = router.map((routerVal, index) => {
    if (routerVal[0].hasOwnProperty("isMenu")) {
      return (
        <Menu.Item key={routerVal[0].title} icon={routerVal[0].icon}>
          <Link to={routerVal[0].path}>{routerVal[0].name}</Link>
        </Menu.Item>
      );
    } else {
      subIndex = subIndex + 1;
      return (
        <SubMenu
          key={"sub" + subIndex}
          icon={<LaptopOutlined />}
          title={subTitle[subIndex - 2]}
        >
          {routerVal.map((menuVal, menuIndex) => {
            keyIndex = keyIndex + 1;
            return (
              <Menu.Item key={keyIndex} icon={menuVal.icon}>
                <Link to={menuVal.path}>{menuVal.name}</Link>
              </Menu.Item>
            );
          })}
        </SubMenu>
      );
    }
  });

  //生成路由dom
  const mapRouteMethod = (data) => {
    return data.map(({ path, component, children, exact }, index) => {
      let Component;
      if (path) {
        //懒加载
        Component =
          typeof component !== "string"
            ? component
            : lazy(() => import(`./view/${component}`));
      }
      if (children) {
        return mapRouteMethod(children);
      }
      return (
        <Route
          key={index}
          exact={exact ? exact : false}
          path={path}
          component={Component}
        />
      );
    });
  };
  // const branch = matchRoutes(routes, window.location.hash.replace(/#\//,''))
  // console.log(branch);
  const branch = window.location.hash.replace(/#\//, "").split("/");
  console.log(branch);
  return (
    <div style={{ width: "100%,", height: "100vh", overflow: "hidden" }}>
      {/* <Spin spinning={loading} delay={5000} tip="loading"> */}
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
              {branch.map((value) => {
                return <Breadcrumb.Item>{value}</Breadcrumb.Item>;
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
                <Switch>
                  <Suspense fallback={<div>Loading...</div>}>
                    {mapRouteMethod(routes)}
                  </Suspense>
                </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      {/* </Spin> */}
    </div>
  );
}
