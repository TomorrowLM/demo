import React, { useState, useEffect } from "react";
import { useHistory, Route } from "react-router-dom";
import { Spin } from "antd";
import request from "../api/request";
const AuthRoute = (props) => {
  const [isCheckingTokenStatus, setIsCheckingTokenStatus] = useState(true);
  const history = useHistory();
  // const tokenIsRefresh = true
  useEffect(() => {
    console.log(window.localStorage.getItem("token"))
    let token = window.localStorage.getItem("token")
    request.get("/token?token="+token).then((res) => {
      history.push("/home");
    });
    if (isCheckingTokenStatus) {
      setIsCheckingTokenStatus(isCheckingTokenStatus, true);
    } else {
      setTimeout(() => {
        setIsCheckingTokenStatus(isCheckingTokenStatus, false);
        history.push("/login");
      }, 1000);
    }
  });

  return isCheckingTokenStatus ? (
    <Route {...props} />
  ) : (
    <Spin tip="Loading..."></Spin>
  );
};

export default AuthRoute;
