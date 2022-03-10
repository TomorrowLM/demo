import React, { useState, useEffect } from "react";
import { useHistory, Route } from "react-router-dom";
import { Spin } from "antd";
import request from "../utils/request";
import { connect } from "react-redux";
import { userInfo } from "../store/actions/userInfo";
import App from "../app";
import usePermissionModel from "../hox/access";

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

  useEffect(() => {
    getUserInfo();
    getAccess();
  }, []);
  return (
    <Spin
      style={{ margin: "auto", position: "absolute", inset: 0, zIndex: 999 }}
      size="large"
      tip="loading"
      spinning={isCheckingTokenStatus}
    >
      <Route path="/" component={App} />
    </Spin>
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
