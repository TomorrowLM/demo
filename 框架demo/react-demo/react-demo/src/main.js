import React from "react";
import ReactDom from "react-dom";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import login from "./view/loign";
import App from "./app.jsx";
import "./css/global.css";
import AuthRoute from "./route/Mock-AuthRoute";
import "antd/dist/antd.css";
ReactDom.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route key={login} path="/login" component={login} />
        {/* 检验token是否正确 */}
        <AuthRoute path="/" component={App} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("App")
);
