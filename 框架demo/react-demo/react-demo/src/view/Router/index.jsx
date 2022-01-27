import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import Second from "./components/Second";

export default function Router() {
  return (
    <div>
      <p>router没有设置exact，那么会将匹配的子页面都渲染出来并放在一个页面</p>
      <ul>
        <li>
          <Link to="/router/1">1</Link>
        </li>
        <li>
          <Link to="/router/2">2</Link>
        </li>
      </ul>
      {/* '/router'路由没有设置exact，那么会将匹配的子页面都渲染出来 */}
      <Switch>
        <Route exact path="/router/:id" component={Second}></Route>
      </Switch>
    </div>
  );
}
