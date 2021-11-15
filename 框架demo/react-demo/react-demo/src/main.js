import React from "react";
import ReactDom from "react-dom";
import { Route, HashRouter as Router, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Login from "./view/Loign";
import AuthRoute from "./route/Mock-AuthRoute";
import App from "./app.jsx";
import "./css/global.css";
import "antd/dist/antd.css";
ReactDom.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route key={Login} path="/Login" component={Login} />
        {/* 检验token是否正确 */}
        <AuthRoute path="/" component={App} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("App")
);
