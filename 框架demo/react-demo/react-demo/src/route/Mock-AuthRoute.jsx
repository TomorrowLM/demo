import React, { useState, useEffect } from "react";
import { useHistory, Route } from "react-router-dom";
import { Spin } from "antd";

const AuthRoute = (props) => {
  const [isCheckingTokenStatus, setIsCheckingTokenStatus] = useState(true);
  const history = useHistory();
  // const tokenIsRefresh = true
  useEffect(() => {
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
