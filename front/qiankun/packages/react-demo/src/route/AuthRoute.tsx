// @ts-nocheck
import React, { useEffect, lazy, Suspense, useCallback } from "react";
import { useHistory, Route } from "react-router-dom";
import { Spin } from "antd";
import { routes } from "@/route/index.js";
import styles from "@/assets/styles/index.module.less";
import { useDispatch } from "react-redux";
import request from "@/utils/request";
import { userInfo } from "@/store/actions/userInfo";
const AuthRoute = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const getUserInfo = useCallback(async () => {
    try {
      const res = await request.get("/common/userInfo");
      const info = res.data;
      dispatch(userInfo(info));
    } catch (err) {
      // 401 会在 shared request 里做跳转，这里只兜底避免红屏
      console.log("getUserInfo", err);
    }
  }, []);
  //保存路由权限
  const getAccess = () => {
    // request.get("/common/access").then((res) => {
    //   console.log("getAccess", res);
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
      // 对于仅作为分组的节点（没有 path，但有 children），直接下钻，不生成额外 Route，避免重复 key/path
      if (!path && children) {
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
    getUserInfo();
  }, []);
  return (
    <>{mapRouteMethod([routes])}</>
  );
};
export default AuthRoute;
