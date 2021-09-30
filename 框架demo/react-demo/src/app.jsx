import React from "react";
import { menu } from "./route/index.js";
import {
  Link,
  Route,
  HashRouter,
  IndexRedirect,
  Switch,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import login from "./components/loign";
export default function App() {
  return (
    <div>
      <Provider store={store}>
        <div>123</div>
        {/* <HashRouter>
          <Switch>
            <Route key={login} path={"/login"} component={login} />
            <Route key={menu} path={menu}>
              {menu.map(({ path, component }) => {
                return (
                  <Route
                    key={path}
                    path={path}
                    component={component}
                    {...menu}
                  />
                );
              })}
            </Route>
            <AuthRoute path="/" component={App} />
          </Switch>
        </HashRouter> */}
      </Provider>
    </div>
  );
}
