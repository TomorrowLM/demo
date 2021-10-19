import React, { useState, useEffect } from "react";
import { useHistory, Route } from "react-router-dom";
import { Spin } from "antd";
import request from "../api/request";
const AuthRoute = (props) => {
  const [isCheckingTokenStatus, setIsCheckingTokenStatus] = useState(true);
  const history = useHistory();
  useEffect(() => {
    request.get("/token").then((res) => {
      if (res.status === 401) {
        history.push("/login");
      }
    });
  });
  return isCheckingTokenStatus ? (
    <Route {...props} />
  ) : (
    <Spin tip="Loading..."></Spin>
  );
};

export default AuthRoute;
