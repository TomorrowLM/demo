import React, { useState, useEffect, lazy, Suspense } from "react";
import { useHistory, Route } from "react-router-dom";
import { Spin } from "antd";
import request from "@/utils/request";
import { connect } from "react-redux";
import { userInfo } from "../store/actions/userInfo";
import usePermissionModel from "../hox/access";
import { routes } from "@/route/index.js";
import styles from "@/assets/styles/index.module.less";

const AuthRoute = (props) => {
  const { getuserInfo } = props;
  const history = useHistory();
  const [isCheckingTokenStatus, setIsCheckingTokenStatus] = useState(true);
  const { set } = usePermissionModel();
  //保存用户信息
  const getUserInfo = () => {
    request
      .get("/common/userInfo")
      .then((res) => {
        console.log("getUserInfo", res);
        if (res.status === 401) {
          setIsCheckingTokenStatus(false);
          return;
        }
        setIsCheckingTokenStatus(false);
        const action = userInfo(res.data.data);
        getuserInfo(action);
      })
      .catch((err) => {
        console.log("getUserInfo", err);
        setIsCheckingTokenStatus(false);
      });
  };
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
  const mapRouteMethod = (data) => {
    console.log("mapRouteMethod", data);
    return data.map(({ path, exact, component, children }, index) => {
      if (!path && children) {
        return mapRouteMethod(children);
      }
      const Component = !component ? (
        <>
          <Route
            path={path}
            exact={exact ? exact : false}
            component={() => <div>404</div>}
          ></Route>
        </>
      ) : typeof component !== "string" ? (
        component
      ) : (
        lazy(() => import(`@/view/${component}`))
      );
      if (children) {
        return (
          <Suspense key={path} fallback={<div>{/* <Spin></Spin> */}</div>}>
            <Route
              key={path}
              exact={exact ? exact : false}
              path={path}
              render={(props) => {
                return <Component>{mapRouteMethod(children)} </Component>;
              }}
            ></Route>
          </Suspense>
        );
      }
      return (
        <Suspense
          key={path}
          fallback={
            <div className={styles.loading_container}>
              <Spin></Spin>
            </div>
          }
        >
          <Route
            key={path}
            path={path}
            exact={exact ? exact : false}
            component={Component}
          />
        </Suspense>
      );
    });
  };

  useEffect(() => {
    if (!location.href.includes("login")) getUserInfo();
    getAccess();
  }, []);
  return (
    <div>
      <Spin
        style={{ margin: "auto", position: "absolute", inset: 0, zIndex: 999 }}
        size="large"
        tip="loading"
        spinning={isCheckingTokenStatus}
      >
        {mapRouteMethod([routes])}
      </Spin>
    </div>
  );
};
function mapStateToProps(state) {
  return {
    info: state.userInfo,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getuserInfo: (action) => dispatch(action),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AuthRoute); // 挂载到props
