import React, { useState, useEffect } from "react";
import { useHistory, Route } from "react-router-dom";
import { Spin } from "antd";
import request from "../api/request";
import { connect } from "react-redux";
import { userInfo } from "../store/actions/userInfo";
import App from "../app";

const AuthRoute = (props) => {
  const { getuserInfo } = props;
  const history = useHistory();
  const [isCheckingTokenStatus, setIsCheckingTokenStatus] = useState(true);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  useEffect(() => {
    setToken(window.localStorage.getItem("token"));
    request.get("/users").then((res) => {
      if (res.status === 401) {
        history.push("/login");
        setIsCheckingTokenStatus(false);
        return;
      }
      const action = userInfo(res.data.data);
      getuserInfo(action);
    });
  }, [token]);
  return isCheckingTokenStatus ? (
    <Route path="/" component={App} />
  ) : (
    <Spin tip="Loading..."></Spin>
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
