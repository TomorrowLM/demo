import React from "react";
import { HashRouter as Router, Switch } from "react-router-dom";
import AuthRoute from "@/route/AuthRoute";
import { whiteRoute, routes } from "@/route";
import { Route, Link } from "react-router";
export default function App() {
  return (
    <Router>
      {whiteRoute.map((val) => {
        return (
          <Route key={val.path} path={val.path} component={val.component} />
        );
      })}
      <Switch>
        <AuthRoute />
        {/* <Route key="index" path="/" component={val.component}>
        </Route> */}
      </Switch>
    </Router>
  );
}
