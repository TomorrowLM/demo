import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import { Link, Route, HashRouter, IndexRoute } from "react-router-dom";

import route from "../route/index.js";
import { Provider } from "react-redux";
import store from "../store";
const useStyles = makeStyles(() => ({
  root: {
    color: "white",
    height: 48,
    padding: "0 100px",
    margin: "50px 0",
  },
}));
export default function Menu() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Provider store={store}>
        <HashRouter>
          <AppBar position="static">
            <ul>
              {route.map((item, index) => {
                return (
                  <li key={index}>
                    <Link to={`/${item.path}`} replace={true}>
                      {item.path}
                    </Link>
                  </li>
                );
              })}
              <Link to="/" replace={true}></Link>
            </ul>
          </AppBar>
          {/* Hash history cannot PUSH the same path; a new entry will not be added to the */}
          {/* 这个是 reactr-router 的一个提示，当前路由下的 history 不能 push 相同的路径到 stack 里。只有开发环境存在，生产环境不存在，目前还没看到官方有去掉的意思。 */}
          {/* replace={true} */}
          <Route path="/About" component={route[2].component}></Route>
          <Route path="/User" component={route[1].component} exact></Route>
          <Route path="/Home" component={route[0].component} exact></Route>
          <Route path="/" component={route[0].component} exact></Route>
        </HashRouter>
      </Provider>
    </div>
  );
}
