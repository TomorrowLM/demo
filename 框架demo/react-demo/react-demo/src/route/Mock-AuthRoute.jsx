import React, { useState, useEffect } from "react";
import { useHistory, Route } from "react-router-dom";
import { Spin } from "antd";
import request from "../api/request";
const AuthRoute = (props) => {
  const [isCheckingTokenStatus, setIsCheckingTokenStatus] = useState(true);
  const history = useHistory();
  // const tokenIsRefresh = true
  useEffect(() => {
    console.log(window.localStorage.getItem("token"));
    let token = window.localStorage.getItem("token");
    request.get("/token").then((res) => {
      // if (res.response.status === 401) {
      //   history.push("/login");
      // }
      // history.push("/home");
    });
  });

  return isCheckingTokenStatus ? (
    <Route {...props} />
  ) : (
    <Spin tip="Loading..."></Spin>
  );
};

export default AuthRoute;
