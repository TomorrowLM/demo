import React from "react";
import ReactDom from "react-dom";
import { Route, HashRouter as Router, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Login from "./view/Login";
import AuthRoute from "./route/Mock-AuthRoute";

import "./global.less";
import "antd/dist/antd.css";

ReactDom.render(
  // Provider下的所有组件可以通过connect来获取store上存储的数据
  <Provider store={store}>
    <Router>
      <Switch>
        <Route key={Login} path="/Login" component={Login} />
        {/* 检验token是否正确 */}
        <AuthRoute />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("App")
);
