// @ts-nocheck
import React, { useEffect, lazy, Suspense } from "react";
import { useHistory, Route } from "react-router-dom";
import { Spin } from "antd";
import { routes } from "@/route/index.js";
import styles from "@/assets/styles/index.module.less";

const AuthRoute = () => {
  const history = useHistory();
  //保存路由权限
  const getAccess = () => {
    // request.get("/common/access").then((res) => {
    //   localStorage.setItem(
    //     "access",
    //     JSON.stringify({
    //       menus: res.data.data.menus,
    //       buttons: res.data.data.buttons,
    //     })
    //   );
    //   set(res.data.data);
    // });
  };
  //生成路由dom
  const mapRouteMethod = (data, parentPath = "") => {
    console.log("mapRouteMethod", data, parentPath);
    return data.map(({ path, exact, component, children }, index) => {
      const fullPath = path ? `${parentPath}${path}` : parentPath;
      if (!fullPath && children) {
        return mapRouteMethod(children, parentPath);
      }
      const Component = !component
        ? children
          ? ({ children: inner }) => <>{inner}</>
          : () => <div>404</div>
        : typeof component !== "string"
          ? component
          : lazy(() => import(`@/view/${component}`));
      if (children) {
        return (
          <Suspense key={fullPath || index} fallback={<div>{/* <Spin></Spin> */}</div>}>
            <Route
              key={fullPath || index}
              exact={exact ? exact : false}
              path={fullPath}
              render={(props) => {
                return <Component>{mapRouteMethod(children, fullPath)} </Component>;
              }}
            ></Route>
          </Suspense>
        );
      }
      return (
        <Suspense
          key={fullPath || index}
          fallback={
            <div className={styles.loading_container}>
              <Spin></Spin>
            </div>
          }
        >
          <Route
            key={fullPath || index}
            path={fullPath}
            exact={exact ? exact : false}
            component={Component}
          />
        </Suspense>
      );
    });
  };

  useEffect(() => {
    getAccess();
  }, []);
  return (
    <>{mapRouteMethod([routes])}</>
  );
};
export default AuthRoute;
