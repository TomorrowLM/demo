import React from "react";
import { HashRouter as Router, Switch } from "react-router-dom";
import AuthRoute from "@/route/AuthRoute";

export default function App() {
  return (
    <Router>
      <Switch>
        <AuthRoute />
      </Switch>
    </Router>
  );
}
