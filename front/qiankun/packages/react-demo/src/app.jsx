import React, { useCallback, useEffect, useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import AuthRoute from "@/route/AuthRoute";
import { whiteRoute } from "@/route";
import request from "@/utils/request";
import { useDispatch } from "react-redux";
import { userInfo } from "@/store/actions/userInfo";
import { Spin } from "antd";
import useAuthModel from "@/hox/auth";

export default function App() {
  console.log(whiteRoute, GLOBAL_INFO, "Second1");
  const dispatch = useDispatch();
  const { token } = useAuthModel();
  const [isCheckingTokenStatus, setIsCheckingTokenStatus] = useState(!!token);

  const getUserInfo = useCallback(async () => {
    try {
      const res = await request.get("/common/userInfo");
      const info = res.data;
      dispatch(userInfo(info));
    } catch (err) {
      // 401 会在 shared request 里做跳转，这里只兜底避免红屏
      console.log("getUserInfo", err);
    } finally {
      setIsCheckingTokenStatus(false);
    }
  }, [token]);

  useEffect(() => {
    getUserInfo();
    // token 变化时，如果存在 token，则重新拉取用户信息
    if (!token) {
      setIsCheckingTokenStatus(false);
      return;
    }
    setIsCheckingTokenStatus(true);
  }, [token, getUserInfo]);
  return (
    <Router>
      {whiteRoute.map((val) => {
        return (
          <Route key={val.path} path={val.path} component={val.component} />
        );
      })}
      <Switch>
        {token && (
          <Spin
            style={{
              margin: "auto",
              position: "absolute",
              inset: 0,
              zIndex: 999,
            }}
            size="large"
            tip="loading"
            spinning={isCheckingTokenStatus}
          >
            <AuthRoute />
          </Spin>
        )}
      </Switch>
    </Router>
  );
}
