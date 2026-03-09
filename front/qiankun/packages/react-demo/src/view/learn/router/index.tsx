import React, { useEffect, useState, ReactNode } from "react";
import { Divider } from "antd";
import { Route, Link, Switch } from "react-router-dom";
import LmCard from "@/components/Lm-card";

interface RouterProps {
  children?: ReactNode;
}
const Router: React.FC<RouterProps> = (props: RouterProps) => {
  console.log(props.children);

  useEffect(() => {
    console.log("渲染");
  });
  return (
    <div>
      <LmCard title="路由嵌套示例">
        <li>
          <Link to="/learn/router/1">1</Link>
        </li>
        <li>
          <Link to="/learn/router/2">2</Link>
        </li>

        {props.children}
      </LmCard>
      <Divider />

    </div>
  );
}
export default Router;  