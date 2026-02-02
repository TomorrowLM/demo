import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import AuthRoute from "@/route/AuthRoute";
import { whiteRoute } from "@/route";

export default function App() {
  console.log(whiteRoute, GLOBAL_INFO, "Second1");
  return (
    <Router>
      {whiteRoute.map((val) => {
        return (
          <Route key={val.path} path={val.path} component={val.component} />
        );
      })}
      <Switch>
        <AuthRoute />
      </Switch>
    </Router>
  );
}
