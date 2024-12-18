import React, { useState, useEffect, lazy, Suspense } from "react";
import { useHistory, Route, Switch, Redirect } from "react-router-dom";
import { Spin } from "antd";
import request from "@/utils/request";
import { connect } from "react-redux";
import { userInfo } from "../store/actions/userInfo";
import usePermissionModel from "../hox/access";
import { routes } from "@/route/index.js";
import Login from "@/view/User/Login";

import styles from '@/view/index.module.less';

const AuthRoute = (props) => {
  const { getuserInfo } = props;
  const history = useHistory();
  const [isCheckingTokenStatus, setIsCheckingTokenStatus] = useState(true);

  const { set } = usePermissionModel();
  //保存用户信息
  const getUserInfo = () => {
    request.get("/users").then((res) => {
      if (res.status === 401) {
        history.push("/user/login");
        setIsCheckingTokenStatus(false);
        return;
      }
      setTimeout(() => {
        setIsCheckingTokenStatus(false);
      }, 10);
      const action = userInfo(res.data.data);
      getuserInfo(action);
    });
  };
  //保存路由权限
  const getAccess = () => {
    request.get("/access").then((res) => {
      localStorage.setItem(
        "access",
        JSON.stringify({
          menus: res.data.data.menus,
          buttons: res.data.data.buttons,
        })
      );
      set(res.data.data);
    });
  };
  //生成路由dom
  const mapRouteMethod = (data) => {
    return data.map(({ path, exact, component, children }, index) => {
      const Component = typeof component !== 'string' ? component : lazy(() => import(`@/view/${component}`));
      if (!path && children) {
        return mapRouteMethod(children)
      }
      if (path && children) {
        return <Suspense key={path} fallback={<div className={styles.loading_container}><Spin></Spin></div>}>
          <Route key={path} exact={exact ? exact : false} path={path} render={(props) => {
            return <Component>{mapRouteMethod(children)} </Component>
          }}></Route>
        </Suspense>
      }
      return <Suspense key={path} fallback={<div className={styles.loading_container}><Spin></Spin></div>}>
        <Route key={path} path={path} exact={exact ? exact : false} component={Component} />
      </Suspense>
    })
  }

  useEffect(() => {
    getUserInfo();
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
        {mapRouteMethod(routes)}
        <Redirect from="/*" to="/dashboard"></Redirect>
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
