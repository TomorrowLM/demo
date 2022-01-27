import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import Second from "./Second";

export default function Router(params) {
  return (
    <div>
      <span>router</span>
      <ul>
        <li>
          <Link to="/router/second/1">1</Link>
        </li>
        <li>
          <Link to="/router/second/12">2</Link>
        </li>
      </ul>
      {/* <Switch>
        <Route exact path="router/second/:id" component={Second}>
        </Route>
      </Switch> */}
    </div>
  );
}
