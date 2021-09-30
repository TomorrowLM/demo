import React from "react";
import ReactDom from "react-dom";
import { menu } from "./route/index.js";
import { Route, HashRouter, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import login from "./components/loign";
import App from "./app.jsx";
import "./css/global.css";
import AuthRoute from "./route/Mock-AuthRoute";
import "antd/dist/antd.css";

ReactDom.render(
  <div
    style={{
    //   display: "flex",
    //   justifyContent: "center",
    //   alignItems: "center",
    //   width: "100vw",
    //   height: "100vh",
    }}
  >
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Route key={login} path="/login" component={login} />
          {/* <Route key={menu} path={menu}>
            {menu.map(({ path, component }) => {
              return (
                <Route key={path} path={path} component={component} {...menu} />
              );
            })}
          </Route> */}
          {/* 检验token是否正确 */}
          <AuthRoute path="/" component={App} />
        </Switch>
      </HashRouter>
    </Provider>
  </div>,
  document.getElementById("App")
);
