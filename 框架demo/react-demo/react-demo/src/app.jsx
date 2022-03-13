import React from "react";
import {
  Route,
  HashRouter as Router,
  Switch,
} from "react-router-dom";
import Login from "@/view/User/Login.jsx";
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
